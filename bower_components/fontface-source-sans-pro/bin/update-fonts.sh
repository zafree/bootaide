#!/bin/bash

# Find base directory
BASE_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )/.." && pwd )"
cd $BASE_DIR/

# Check fonts versions
VER_LOCAL="$(cat fonts/bower.json | grep version | sed 's|.*: "\(.*\)".*|\1|g')"
VER_REPO="$(curl -s https://raw.githubusercontent.com/adobe-fonts/source-sans-pro/release/bower.json | grep version | sed 's|.*: "\(.*\)".*|\1|g')"

echo "[-] Detect Fonts Version:"
echo "    - Local: $VER_LOCAL"
echo "    - Repo:  $VER_REPO"

[[ "$VER_LOCAL" == "$VER_REPO" ]] && {
    echo "[-] No update require."
    exit 0
}

# Update fonts
echo "[-] Updating fonts..."
rm -Rf ./fonts/
git clone -b release --single-branch git://github.com/adobe-fonts/source-sans-pro.git fonts
cd fonts/

# Update version information
TAG_INFO=$(git log --tags --simplify-by-decoration --pretty="format:%aD|%d|%B" | head -1)
TAG_DATE=$(echo $TAG_INFO | awk -F'|' '{ print substr($1, 0, index($1, ":")-4) }')
TAG_VER=$(echo $TAG_INFO | sed 's/.*tag: \(.*\))|.*/\1/g')
TAG_DESC=$(echo $TAG_INFO | awk -F'|' '{ print $3; }')

echo "[-] Update information:"
echo "    - Release: [$TAG_VER] $TAG_DESC"
echo "    - Date: $TAG_DATE"

# Update README.md
sed -i.tmp "s|^\* Release: .*|\* Release: [$TAG_VER] $TAG_DESC|g" ../README.md 
sed -i.tmp "s|^\* Date: .*|\* Date: $TAG_DATE|g" ../README.md 
rm ../README.md.tmp

# Update bower.json
sed -i.tmp "s|\"version\": \".*\"|\"version\": \"$TAG_VER\"|g" ../bower.json
rm ../bower.json.tmp