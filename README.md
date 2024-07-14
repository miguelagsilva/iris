# Git versioning
## Create a new feature branch
### Ensure you are on the main branch with everything up to date
git checkout main
git fetch origin
### Create the new branch and switch to it
git checkout -b new-feature
git status
### Add the files
git add .
git status
### Commit the changes following the commit standard
git commit -m "feat(frontend): Add dropdown language selection"
### Push the changes
git push -u origin new-feature
### Merge the new feature branch into main
git checkout main
git pull
git pull origin new-feature
git push
