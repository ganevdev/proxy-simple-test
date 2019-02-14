const got = jest.fn((url) => {
  if (url === 'https://www.example.com') {
    return Promise.resolve({
      body: '<div><h1>Example Domain</h1></div>'
    });
  }
});

export default got;
