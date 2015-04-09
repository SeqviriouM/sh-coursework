// moment.js makes `moment` global on the window (or global) object, while Meteor expects a file-scoped global variable
vis = this.vis;
delete this.vis;