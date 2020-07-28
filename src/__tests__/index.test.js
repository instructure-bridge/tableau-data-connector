const fs = require('fs');
const path = require('path');

jest
  .dontMock('fs');

describe('button', function () {
  beforeEach(() => {
    const indexFile = path.resolve(__dirname, './test-dist/index.html');
    const html = fs.readFileSync(indexFile);
    document.documentElement.innerHTML = html.toString();
  });

  it('button exists', function () {
    expect(document.getElementById('credentialsButton')).toBeTruthy();
  });
});
