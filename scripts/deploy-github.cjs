const { execSync } = require('child_process');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const REPO_NAME = 'jack-portfolio';
const GITHUB_USER = 's2y4vv-wq';

// Get token from command line or env
const token = process.argv[2] || process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
  console.error(`
Usage: node scripts/deploy-github.cjs <GITHUB_TOKEN>

No GitHub token found. Create one at:
  https://github.com/settings/tokens/new?scopes=repo,workflow&description=jack-portfolio-deploy

Select "repo" and "workflow" scopes, generate the token, then run:
  node scripts/deploy-github.cjs <your-token>

Or set the environment variable and run:
  set GH_TOKEN=<your-token>
  npm run deploy
  `);
  process.exit(1);
}

console.log('Deploying to GitHub Pages...\n');

// Create repo via GitHub API
const https = require('https');

function api(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const bodyStr = body ? JSON.stringify(body) : '';
    const req = https.request({
      hostname: 'api.github.com',
      path: urlPath,
      method,
      headers: {
        'Authorization': `token ${token}`,
        'User-Agent': 'jack-portfolio-deploy',
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': body ? 'application/json' : undefined,
        'Content-Length': body ? Buffer.byteLength(bodyStr) : undefined,
      },
    }, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          if (res.statusCode >= 400) {
            reject(new Error(`API ${res.statusCode}: ${parsed.message}`));
          } else {
            resolve(parsed);
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) resolve({});
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

async function main() {
  try {
    // 1. Create repo (if not exists)
    console.log('[1/5] Creating repository...');
    let repo;
    try {
      repo = await api('POST', '/user/repos', {
        name: REPO_NAME,
        description: '个人作品集网站 - AIGC创作者作品展示',
        private: false,
        auto_init: false,
      });
      console.log('       Created:', repo.html_url);
    } catch (e) {
      if (e.message.includes('already exists') || e.message.includes('422')) {
        console.log('       Repository already exists, continuing...');
      } else {
        throw e;
      }
    }

    // 2. Set git remote
    console.log('[2/5] Setting up git remote...');
    const remoteUrl = `https://oauth2:${token}@github.com/${GITHUB_USER}/${REPO_NAME}.git`;
    try {
      execSync(`git remote add origin "${remoteUrl}"`, { cwd: ROOT, stdio: 'pipe' });
    } catch (e) {
      execSync(`git remote set-url origin "${remoteUrl}"`, { cwd: ROOT, stdio: 'pipe' });
    }
    console.log('       Remote configured');

    // 3. Push code to master (including LFS)
    console.log('[3/5] Pushing code to GitHub (including LFS files)...');
    execSync(`git push -u origin master`, {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, GIT_TERMINAL_PROMPT: '0' },
    });

    // 4. Deploy dist to gh-pages branch
    console.log('[4/5] Deploying to gh-pages branch...');
    execSync('npx gh-pages -d dist -m "Deploy to GitHub Pages [ci skip]"', {
      cwd: ROOT,
      stdio: 'inherit',
      env: { ...process.env, GH_TOKEN: token, GIT_TERMINAL_PROMPT: '0' },
    });

    // 5. Enable GitHub Pages
    console.log('[5/5] Configuring GitHub Pages...');
    try {
      await api('POST', `/repos/${GITHUB_USER}/${REPO_NAME}/pages`, {
        source: {
          branch: 'gh-pages',
          path: '/',
        },
      });
    } catch (e) {
      if (e.message.includes('already exists')) {
        // Update existing pages config
        await api('PUT', `/repos/${GITHUB_USER}/${REPO_NAME}/pages`, {
          source: {
            branch: 'gh-pages',
            path: '/',
          },
        });
      } else {
        console.log('       Note: Could not auto-enable Pages. Enable manually in repo Settings > Pages.');
      }
    }

    console.log(`
Done! Your website will be available at:
  https://${GITHUB_USER}.github.io/${REPO_NAME}/

It may take 1-2 minutes for the first deployment.
    `);
  } catch (err) {
    console.error('\nDeployment failed:', err.message);
    process.exit(1);
  }
}

main();
