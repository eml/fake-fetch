var assert = require('assert');
var _sinon = require('sinon');
var _fakeFetch = require('./');

describe('Fake window.fetch', function () {

    var fakeFetch, sinon;

    beforeEach(function () {
        fakeFetch = _fakeFetch;
        sinon = _sinon;
        global.window = {
            fetch () {
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
        window.fetch.firstCall = { args: ['/foo'] };

        var expectedUrl = fakeFetch.getUrl();

        assert.equal('/foo', expectedUrl);
    });

    it('should return get method by default', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo'] };

        var expectedMethod = fakeFetch.getMethod();

        assert.equal('get', expectedMethod);
    });

    it('should return given request method', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo', { method: 'DELETE' }] };

        var expectedMethod = fakeFetch.getMethod();

        assert.equal('DELETE', expectedMethod);
    });

    it('should return empty request body by default', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo'] };

        var expectedBody = fakeFetch.getBody();

        assert.equal('', expectedBody);
    });

    it('should return given request body', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo', { body: 'foo bar' }] };

        var expectedBody = fakeFetch.getBody();

        assert.equal('foo bar', expectedBody);
    });

    it('should return empty request headers by default', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo'] };

        var expectedHeaders = fakeFetch.getRequestHeaders();

        expect(expectedHeaders).toEqual({});
    });

    it('should return given request headers', function () {
        fakeFetch.install();
        var headers = new Headers({ 'Content-Type': 'application/json' });
        window.fetch.firstCall = {
            args: [
                '/foo',
                { headers }
            ]
        };

        var expectedHeaders = fakeFetch.getRequestHeaders();

        expect(expectedHeaders).toEqual(headers);
    });

    it('should return empty options by default', function () {
        fakeFetch.install();
        window.fetch.firstCall = { args: ['/foo'] };

        var expectedOptions = fakeFetch.getOptions();

        expect(expectedOptions).toEqual({});
    });

    it('should return given request options', function () {
        fakeFetch.install();

        var options = {
            headers: new Headers({ 'Content-Type': 'application/json' }),
            credentials: 'same-origin'
        };
        window.fetch.firstCall = { args: ['/foo', options] };

        var expectedOptions = fakeFetch.getOptions();

        expect(expectedOptions).toEqual(options);
    });

    it('should detect fetch was not called', function () {
        fakeFetch.install();

        expect(fakeFetch.called).toBeFalsy();
    });

    it('should detect fetch was called', function () {
        fakeFetch.install();
        window.fetch('/foo');

        expect(fakeFetch.called).toBeTruthy();
    });

    describe('with Request object', function () {
        it('should return request url', function () {
            fakeFetch.install();
            const request = new Request('https://foo.bar/path');

            window.fetch(request);

            expect(fakeFetch.getUrl()).toEqual(request.url);
        });

        it('should return request method', function () {
            fakeFetch.install();
            const request = new Request('https://foo.bar/path');

            window.fetch(request);

            expect(fakeFetch.getMethod()).toEqual(request.method);
        });

        it('should return request body', function () {
            fakeFetch.install();
            const request = new Request('https://foo.bar/path');

            window.fetch(request, { body: 'foo' });

            expect(fakeFetch.getBody()).toEqual(request.body);
        });

        it('should return request headers', function () {
            fakeFetch.install();
            const headers = new Headers({
                'X-foo': 'foo',
                'X-bar': 'bar'
            });
            const request = new Request('https://foo.bar/path', { headers });

            window.fetch(request);

            expect(fakeFetch.getRequestHeaders()).toEqual(request.headers);
        });
    });
});
