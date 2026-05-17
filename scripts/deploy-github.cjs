const { execSync } = require('child_process');
const https = require('https');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPO_NAME = 'jack-portfolio';
const GITHUB_USER = 's2y4vv-wq';
// gh CLI's OAuth app client_id (public, from GitHub CLI source)
const CLIENT_ID = '1789c2994f3f9c542e30';

function api(method, urlPath, body, token) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const headers = {
      'User-Agent': 'jack-portfolio-deploy',
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': body ? 'application/json' : undefined,
      'Content-Length': body ? Buffer.byteLength(bodyStr) : undefined,
    };
    if (token) headers['Authorization'] = `token ${token}`;

    const req = https.request({
      hostname: urlPath.includes('github.com/login') ? 'github.com' : 'api.github.com',
      path: urlPath,
      method,
      headers,
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`API ${res.statusCode}: ${parsed.message || parsed.error_description || data}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve(data);
          else reject(new Error(`API ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => { req.destroy(); reject(new Error('Timeout')); });
    if (body) req.write(bodyStr);
    req.end();
  });
}

// OAuth device flow
async function getTokenViaDeviceFlow() {
  // 1. Request device code
  console.log('Initiating GitHub login...\n');
  const deviceResp = await api('POST', '/login/device/code', {
    client_id: CLIENT_ID,
    scope: 'repo,workflow',
  });

  // 2. Show user the verification URL and code
  console.log('Please open this URL in your browser:');
  console.log(`  ${deviceResp.verification_uri}\n`);
  console.log('Enter this code:');
  console.log(`  ${deviceResp.user_code}\n`);
  console.log('Waiting for you to authorize... (timeout in 15 minutes)');

  // 3. Try to open browser
  try {
    const { execSync: es } = require('child_process');
    es(`start "${deviceResp.verification_uri}"`, { stdio: 'ignore', shell: true });
  } catch (e) {
    // ignore
  }

  // 4. Poll for token
  const interval = (deviceResp.interval || 5) * 1000;
  const deadline = Date.now() + (deviceResp.expires_in || 900) * 1000;

  while (Date.now() < deadline) {
    await new Promise(r => setTimeout(r, interval));
    try {
      const tokenResp = await api('POST', '/login/oauth/access_token', {
        client_id: CLIENT_ID,
        device_code: deviceResp.device_code,
        grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
      });
      if (tokenResp.access_token) {
        console.log(' Authentication successful!\n');
        return tokenResp.access_token;
      }
    } catch (e) {
      if (e.message.includes('authorization_pending')) {
        // Still waiting, continue polling
        process.stdout.write('.');
        continue;
      }
      throw e;
    }
  }
  throw new Error('Authentication timed out');
}

async function main() {
  let token;

  // Try env var first, then device flow
  token = process.argv[2] || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

  if (!token) {
    console.log('No GitHub token found in environment.\n');
    try {
      token = await getTokenViaDeviceFlow();
    } catch (e) {
      console.error('\nLogin failed:', e.message);
      console.error(`
Alternative: Create a Personal Access Token manually:
  https://github.com/settings/tokens/new?scopes=repo,workflow&description=jack-portfolio

Then run:
  node scripts/deploy-github.cjs <your-token>
`);
      process.exit(1);
    }
  }

  console.log('=== Deploying to GitHub Pages ===\n');

  try {
    // 1. Create repo
    console.log('[1/5] Creating repository...');
    try {
      const repo = await api('POST', '/user/repos', {
        name: REPO_NAME,
        description: '个人作品集网站 - AIGC创作者作品展示',
        private: false,
        auto_init: false,
      }, token);
      console.log('       Repository created:', repo.html_url);
    } catch (e) {
      if (e.message.includes('already exists') || e.message.includes('422')) {
        console.log('       Repository already exists, continuing...');
      } else {
        throw e;
      }
    }

    // 2. Set remote
    console.log('[2/5] Configuring git remote...');
    const remoteUrl = `https://oauth2:${token}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;
    try {
      execSync(`git remote add origin "${remoteUrl}"`, { cwd: ROOT, stdio: 'pipe' });
    } catch (e) {
      execSync(`git remote set-url origin "${remoteUrl}"`, { cwd: ROOT, stdio: 'pipe' });
    }
    console.log('       Remote configured');

    // 3. Push master
    console.log('[3/5] Pushing code to GitHub...');
    execSync(`git push -u origin master`, {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

    // 4. Deploy gh-pages
    console.log('[4/5] Deploying to gh-pages branch...');
    execSync('npx gh-pages -d dist -m "Deploy to GitHub Pages"', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, GH_TOKEN: token, GIT_TERMINAL_PROMPT: '0' },
    });

    // 5. Enable Pages
    console.log('[5/5] Configuring GitHub Pages...');
    try {
      await api('POST', `/repos/${GITHUB_USER}/${REPO_NAME}/pages`, {
        source: { branch: 'gh-pages', path: '/' },
      }, token);
    } catch (e) {
      // Might already be configured, try update
      try {
        await api('PUT', `/repos/${GITHUB_USER}/${REPO_NAME}/pages`, {
          source: { branch: 'gh-pages', path: '/' },
        }, token);
      } catch (e2) {
        console.log('       Note: Please enable Pages manually in repo Settings > Pages');
      }
    }

    console.log(`
=== Deployment complete! ===
Your website will be available at:
  https://${GITHUB_USER}.github.io/${REPO_NAME}/

(It may take 1-2 minutes for the first deployment to finish)
    `);
  } catch (err) {
    console.error('\nDeployment failed:', err.message);
    process.exit(1);
  }
}

main();
