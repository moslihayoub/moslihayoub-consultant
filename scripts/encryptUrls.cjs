const CryptoJS = require("crypto-js");

const password = "031984";

const urls = {
  'the-factory': '/project/the-factory',
  'autocash-sourcing': 'https://autocash-sourcing.vercel.app/',
  'nexastay': 'https://www.figma.com/design/TGjrdYNkeGePCJtO7CPcWp/Nexa-UI--MVP-?m=auto&t=uVDJRvhRmGeplPnd-1',
  'agence-urbaine': 'https://www.figma.com/design/o90lrDQiTOQh1FONj3J8tS/AULO---UI?node-id=2-2&t=eGGC6QfFbh0GwVCp-1',
  'babmoulaydriss': 'https://www.figma.com/design/uGYSzOXevIg0cqZ5JrItID/Bab-Moulay-Idriss---UI?m=auto&t=RTaVZszZ8HeK9H0b-1',
  'foodeals': 'https://www.figma.com/design/6u3Lypzvi31MUMXphsbxmm/Foodeals-Group-solutions---SaaS-Wast?m=auto&t=Pm3rX5XXWGiE8mKi-1',
  'ydg': 'https://www.figma.com/design/qFbb3LpLgDB45CmPxv6Jov/YDG-UI?node-id=2-3&t=mrUDNxVLKoPQAp25-1',
  'laval': 'https://www.figma.com/design/dlv7ZpbwGukMBAvue8CGS5/Source-Info-r%C3%A8glements---MAJ-02-2022?m=auto&t=uVDJRvhRmGeplPnd-1'
};

for (const [id, url] of Object.entries(urls)) {
  const encrypted = CryptoJS.AES.encrypt(url, password).toString();
  console.log(`${id}: ${encrypted}`);
}
