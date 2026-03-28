cd ../MUSE || exit

sed -i '' 's/version-2\.[0-9]*\.[0-9]*-blue/version-2.35.0-blue/g' README.md README_CN.md
sed -i '' 's/MUSE v2\.[0-9]*\.[0-9]*/MUSE v2.35.0/g' README.md README_CN.md

cat << 'INNEREOF' > changelog_temp.md
## [2.35.0] - 2026-03-28

### Added
- **Digital Twin Profiling** — The `/bye` workflow now actively extracts the user's communication style, decision-making logic, and vocabulary, and continuously writes it into a "Digital Twin Profile". This enables the system to increasingly mimic the user's native "Founder's Voice" over time, mirroring the OpenClaw passive adaptation loop.

INNEREOF
cat CHANGELOG.md >> changelog_temp.md
mv changelog_temp.md CHANGELOG.md

git add .
git commit -m "feat(v2.35.0): Digital Twin Profiling SOP"
git push origin main

gh release create v2.35.0 --title "v2.35.0 — Digital Twin Evolution" --notes "## What's New

### 🧠 Digital Twin Profiling in \`/bye\`
The core \`/bye\` wrap-up workflow has been fundamentally upgraded to support passive personality learning. Instead of just saving memory logs, MUSE will now analyze your communication style, decision patterns, and vocabulary in every session to continuously evolve your **Digital Twin Profile**. Your AI coding agent will grow closer to your native Founder's Voice the longer you pair program together.

### ✨ New Features
- Added Step 3.8 to \`/bye\` SOP for passive personality extraction
- Aligned memory behaviors with OpenClaw's passive adaptation model"
