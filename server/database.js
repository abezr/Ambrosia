import r from 'rethinkdb';
import co from 'co';

export function getUser(id, conn) {
  return co(function*() {
    return yield r.table('user').get(id).run(conn, function(err, result) {
      //pass in the connection variable to find subfield...
      if(result) {
        result.conn = conn;
        return result;
      } else {
        return err;
      }
    });
  });
}

export function getUsers(conn) {
  return co(function*() {
    var p = new Promise(function(resolve, reject) {
      r.table('user').run(conn, function(err, result) {
        result.toArray(function(err, res) {
          if (err) reject(err);
          resolve(res);
        });
      });
    });
    return yield p.then(function(value) {
      console.log("schema:query");
      return value;
    });
  });
}

export function addUser(name, conn) {
  return co(function*() {
    var res = yield r.table('user').insert({
      name: name,
      mail: mail,
      password: password
    }, {
      returnChanges: true
    }).run(conn);
    delete res.changes[0].new_val.password;
    return res.changes[0].new_val;
  });
}

export function updateUser(id, name, conn) {
  return co(function*() {
    var res = yield r.table('user').get(id).update({
      name: name
    }, {
      returnChanges: true
    }).run(conn);
    return res.changes[0].new_val;
  });
}
