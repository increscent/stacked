class Uri {
  constructor(app) {
    this.used_uris = [];
    // populate list of used uris when the server starts
    var _this = this;
    app.models.Copy.find(function (err, copies) {
      for (var i = 0; i < copies.length; i++) {
        // insert copies in sorted order
        for (var j = 0; j <= _this.used_uris.length; j++) {
          if (j == _this.used_uris.length) {
            _this.used_uris.push(copies[i].uri);
            break;
          }
          if (copies[i].uri < _this.used_uris[j]) {
            _this.used_uris.splice(j, 0, copies[i].uri);
            break;
          }
        }
      }
    });
  }

  getNext() {
    for (var i = 0; i < this.used_uris.length; i++) {
      if (this.used_uris[i] > i) {
        this.used_uris.splice(i, 0, i);
        return i;
      }
    }
    var length = this.used_uris.length;
    this.used_uris.push(length);
    return length;
  }

  unset(uri) {
    this.used_uris.splice(this.used_uris.indexOf(uri), 1);
  }
}

module.exports = function (app) {
  return new Uri(app);
}
