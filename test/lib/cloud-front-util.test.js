var path = require('path')
  , url = require('url')
  , querystring = require('querystring')
  , fs = require('fs')
  , test = require("tap").test
  , cf = require(path.join(process.cwd(), 'lib', 'cloudfront-util'))
  , DEFAULT_PARAMS = {
      keypairId: 'ABC123'
    , privateKeyString: fs.readFileSync(path.join(process.cwd(), 'test', 'files', 'dummy.pem')).toString('ascii')
  }
;

test('canned policy', function(t) {
  var now = new Date()
    , result = url.parse(cf.getSignedUrl('http://foo.com', DEFAULT_PARAMS))
  ;
  result.query = querystring.parse(result.search.split('?')[1]);
  t.equal(result.hostname, 'foo.com', 'it should set the appropriate domain');
  t.equal(result.query['Key-Pair-Id'], DEFAULT_PARAMS.keypairId, 'it should set the key pair id');
  var expireDiff = Math.abs(new Date(result.query.Expires * 1000).getSeconds() - now.getSeconds());
  t.ok(29 <= expireDiff && 31 >= expireDiff, 'it should default `expires` to ~30 seconds from creation date')
  t.end();
});