
describe("layout", function(){
  describe("template", function(){
    it("shows 'Foosboom' heading", function(){
      expect($('h1').text()).toEqual('Foosboom');
    });
  });
});
