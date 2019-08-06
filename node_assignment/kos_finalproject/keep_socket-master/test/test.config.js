//  Test Configuration Object
const users = {
    user1: { username: 'koushic', password: 'koushic' },
    user1WithWrongPassword: { username: 'koushic', password: 'kou' },
    user2: { username: 'vignesh', password: 'vignesh' },
    user3: { username: 'mohan', password: 'mohan' },
    
};

const userInfo = {
  user1: { username: 'koushic' }
};


const mockNotes = {
  noteOne: { title: 'title1', text: 'text1', state: 'not-started', userId: 'jennings' },
  noteTwo: { title: 'title2', text: 'text1', state: 'not-started', userId: 'mohan' }
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
