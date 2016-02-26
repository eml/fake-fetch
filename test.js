var assert = require('assert');
var _sinon = require('sinon');
var _fakeFetch = require('./');

describe('Fake window.fetch', function () {

  var fakeFetch, sinon;

  beforeEach(function () {
    fakeFetch = _fakeFetch;
    sinon = _sinon;
    global.window = {
      fetch: function () {
      }
    };
  });

  afterEach(function () {
    global.window = undefined;
    window.fetch.restore();
  });


  it('install should stub window.fetch', function () {
    _sinon.spy(sinon, 'stub');

    fakeFetch.install();

    assert(sinon.stub.calledWith(window, 'fetch'));
  });

  it('should return request url', function () {
    fakeFetch.install();
    window.fetch.firstCall = {args: ['/foo']};

    var expectedUrl = fakeFetch.getUrl();

    assert.equal('/foo', expectedUrl);
  });

  it('should return get method by default', function () {
    fakeFetch.install();
    window.fetch.firstCall = {args: ['/foo']};

    var expectedMethod = fakeFetch.getMethod();

    assert.equal('get', expectedMethod);
  });

  it('should return given request method', function () {
    fakeFetch.install();
    window.fetch.firstCall = {args: ['/foo', {method: 'DELETE'}]};

    var expectedMethod = fakeFetch.getMethod();

    assert.equal('DELETE', expectedMethod);
  });

  it('should return empty request body by default', function () {
    fakeFetch.install();
    window.fetch.firstCall = {args: ['/foo']};

    var expectedBody = fakeFetch.getBody();

    assert.equal('', expectedBody);
  });

  it('should return given request body', function () {
    fakeFetch.install();
    window.fetch.firstCall = {args: ['/foo', {body: 'foo bar'}]};

    var expectedBody = fakeFetch.getBody();

    assert.equal('foo bar', expectedBody);
  });

  it('ss', function () {
    fakeFetch.install();
    for (var key in window.fetch) {
      //console.log(key);
    }


    window.fetch.firstCall = {args: ['/foo', {body: 'foo bar'}]};

    fetch("/test", {headers: {"accept": "*"}});
    fetch("/foo-bar", {"method": "post"});


//    console.log(window.fetch.getCalls());
    //console.log(JSON.stringify(window.fetch.getCall(0)));
    console.log(window.fetch.callCount);
    //for (var key in window.fetch.getCall(0)) {
//          console.log(window.fetch.getCall(0).args);
    //    }
//    console.log(window.fetch.getCall(1));

    window.fetch.getCalls().forEach(function (call) {
      console.log(call.args);
    });


    assert.equal('foo bar', 'foo bar');
  });

});
