const { Menu } = require("electron");
const pkg = require("./package.json");
const path = require("path");
const aboutIcon = path.join(__dirname, "build/icons/24x24.png");
const open = require("open");

const template = [
  {
    label: "File",
    submenu: [{ role: "quit" }]
  },
  {
    label: "Edit",
    submenu: [
      { role: "undo" },
      { role: "redo" },
      { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "delete" },
      { type: "separator" },
      { role: "selectAll" }
    ]
  },
  {
    label: "View",
    submenu: [
      { role: "reload" },
      { role: "forcereload" },
      { role: "toggledevtools" },
      { type: "separator" },
      { role: "resetzoom" },
      { role: "zoomin" },
      { role: "zoomout" },
      { type: "separator" },
      { role: "togglefullscreen" }
    ]
  },
  {
    role: "help",
    submenu: [
      {
        label: "About",
        icon: aboutIcon,
        click() {
          const aboutUrl = "https://github.com/Spyna/teams-for-linux";
          open(aboutUrl, err => {
            if (err) {
              alert(`cannot open link ${aboutUrl}`);
            }
          });
        }
      },
      { label: `Version ${pkg.version}`, enabled: false }
    ]
  }
];

const menu = Menu.buildFromTemplate(template);
module.exports = menu;
