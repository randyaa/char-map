import { CharMapPage } from './app.po';

describe('char-map App', function() {
  let page: CharMapPage;

  beforeEach(() => {
    page = new CharMapPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
