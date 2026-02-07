import fs from 'fs';
import path from 'path';
import { Octokit } from '@octokit/rest';
import fm from 'front-matter';

const ISSUES_DIR = '.issues';
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');

async function sync() {
  const files = fs.readdirSync(ISSUES_DIR).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const filePath = path.join(ISSUES_DIR, file);
    const content = fs.readFileSync(filePath, 'utf8');
    const { attributes, body } = fm(content);
    
    if (!attributes.gh_number) {
      console.log(`Creating issue for ${file}...`);
      const { data } = await octokit.issues.create({
        owner,
        repo,
        title: attributes.title,
        body: body,
        labels: attributes.labels || []
      });
      
      const newContent = `---\ntitle: ${attributes.title}\nstatus: ${attributes.status || 'OPEN'}\ngh_number: ${data.number}\n---\n${body}`;
      fs.writeFileSync(filePath, newContent);
      console.log(`Created GitHub Issue #${data.number}`);
    } else {
      console.log(`Updating issue #${attributes.gh_number}...`);
      await octokit.issues.update({
        owner,
        repo,
        issue_number: attributes.gh_number,
        title: attributes.title,
        body: body
      });
    }
  }
}

sync().catch(err => {
  console.error(err);
  process.exit(1);
});
