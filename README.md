# Kudakwashe Delan Sibanda — AWS Cloud Security Portfolio

A modern, accessible, static portfolio for GitHub Pages. It positions Kudakwashe’s DevOps and software-development experience as the foundation for a specialization in AWS cloud security engineering.

## Portfolio content

- Recruiter-focused AWS cloud-security positioning
- Existing DevOps and cloud-engineering experience
- Verified public GitHub and LinkedIn links
- Clearly labelled planned cloud-security labs
- Interactive filters, detailed project briefs, theme switching, responsive navigation, scroll effects, and reduced-motion support
- Automated GitHub Pages deployment

## Publish on GitHub Pages

1. Create a public GitHub repository named `DelaneKay.github.io`.
2. Copy this project into that repository and push it to the `main` branch.
3. Open the repository on GitHub.
4. Go to **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**.
6. Open the **Actions** tab and confirm that “Deploy portfolio to GitHub Pages” completes successfully.
7. Visit `https://delanekay.github.io/`.

The included workflow also supports a repository whose default branch is still named `master`.

## Maintain the portfolio

- Update the planned-project labels only after each lab has been built, tested, documented, and linked.
- Replace project briefs with real architecture diagrams, findings, test evidence, and lessons learned.
- Keep credentials and career history aligned with LinkedIn.
- Never commit AWS access keys, account secrets, private employer information, or unredacted logs.

## Local preview

Because the site uses only HTML, CSS, and JavaScript, it can be opened directly. For the most accurate preview, run a small local web server in this folder and open the local address it provides.

## Key files

- `index.html` — portfolio content and accessible structure
- `assets/styles.css` — visual system, motion, and responsive layout
- `assets/script.js` — interactions and project briefs
- `.github/workflows/deploy.yml` — GitHub Pages deployment
- `404.html` — custom not-found page

