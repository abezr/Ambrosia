import r from 'rethinkdb';
import co from 'co';

export function getUser(cookie) {
  if(cookie.get('user')) {
    return cookie.get('user');
  } else {
    return {
      name: '',
      mail: ''
    };
  }
}

export function getUserByCredentials(credentials, rootValue) {
  return co(function*() {
    console.log(credentials);
    var result;
    yield r.table('user').filter(function(user) {
      return (user('mail').eq(credentials.mail)
          .or(user('pseudo').eq(credentials.mail)))
        .and(user('password').eq(credentials.password));
    }).run(rootValue.conn, function(error, cursor) {
      if (error) throw error;
      if (cursor.length === 0) {
        console.log('database:cursor.length=0');
        return {
          mail: '',
          pseudo: '',
          error: 'mail or password incorrect'
        };
      }
      cursor.each(function(err, row) {
        console.log('database:cursor.each', row);
        if (err) throw err;
        result = row;
      });
    });
    rootValue.cookie.set('user', result);
    return result;
  });
}

export function getUsers(conn) {
  return co(function*() {
      var friends;
      yield r.table('user').run(conn, function(err, result) {
        friends = result;
      });
      console.log('database', friends);
      return friends.toArray();
    });
}

export function addUser(credentials, rootValue) {
  return co(function*() {
    // yield r.table('user').insert({
    //   name: credentials.name,
    //   mail: credentials.mail,
    //   password: credentials.password
    // }).run(conn, function (err, result) {
    //   console.log('database:addUser', err, result);
    // });
    var user = yield r.table('user').insert({
      mail: credentials.mail,
      password: credentials.password
    }, {
      returnChanges: true
    }).run(rootValue.conn, function(err, result) {
      console.log('database:addUser', result.changes[0].new_val, result);
    });
    rootValue.cookie.set('user', user.changes[0].new_val);
    return user.changes[0].new_val;
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
