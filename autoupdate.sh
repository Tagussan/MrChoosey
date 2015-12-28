#!/bin/sh
commit_time=`date +%Y/%m/%d/%T`
echo GitAutoPusher v1
echo Commit Time:
echo $commit_time

if [ $# -gt 2 ]
  then
  echo Error: Wrong number of argument
elif [ $1 != "-s" ] && [ $1 != "-h" ]
  then
  echo Error: Unknown option $1
else
  git add .

  if [ $# -eq 2 ] && [ -n $2 ]
    then
    git commit -m $2
  else
    git commit -m "GitAutoPush at $commit_time"
  fi

  git push origin master
  git checkout gh-pages
  git rebase master
  git push origin gh-pages
  git checkout master
fi
