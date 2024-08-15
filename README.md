# Git versioning
## Create a new feature branch
### Ensure you are on the main branch with everything up to date
```shell
git checkout main
git fetch origin
```
### Create the new branch and switch to it
```shell
git checkout -b new-feature
git status
```
### Add the files
```shell
git add .
git status
```
### Commit the changes following the commit standard
```shell
git commit -m 'feat(frontend): Add dropdown language selection'
```
### Push the changes
```shell
git push -u origin new-feature
```
### Merge the new feature branch into main
```shell
git checkout main
git merge --no-ff new-feature
```
### Delete the old branch
```shell
git branch -d new-feature
```
### Push results
```shell
git push origin main
```
## frontend
### Generate the Api.ts file for api requests
```shell
pnpm run generate-api
```
