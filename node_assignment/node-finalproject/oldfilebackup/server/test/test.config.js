//  Test Configuration Object
const users = {
    user1: { username: 'gopal', password: 'gopal' },
    user1WithWrongPassword: { username: 'gopal', password: 'gop' },
    user2: { username: 'mani', password: 'mani' },
    user3: { username: 'niti', password: 'niti' },
    
};

const userInfo = {
  user1: { username: 'gopal' }
};


const mockNotes = {
  noteOne: { title: 'title1', text: 'text1', state: 'not-started', userId: 'jennings' },
  noteTwo: { title: 'title2', text: 'text1', state: 'not-started', userId: 'niti' }
}

payload1 = {"id":users.user1.username,"username":users.user1.username,"password":users.user1.password}

payload2 = {"id":users.user2.username,"username":users.user2.username,"password":users.user2.password}

module.exports = {
    users,
    mockNotes,
    payload1,
    payload2,
    userInfo
};
