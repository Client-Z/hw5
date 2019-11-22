cd hw5
touch file.txt
git pull https://bd01afb6465109c5860fb3d8aae2fa69caf4c7a4@github.com/Client-Z/hw5.git
npm install
pm2 delete index
npm run db:migrate
pm2 start index.js