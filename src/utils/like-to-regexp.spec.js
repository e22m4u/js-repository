import {expect} from 'chai';
import {likeToRegexp} from './like-to-regexp.js';

describe('likeToRegexp', function () {
  it('throws an error if the pattern is not a string', function () {
    const error = v =>
      'The first argument of `likeToRegexp` ' +
      `should be a String, but ${v} was given.`;
    expect(() => likeToRegexp(123)).to.throw(error('123'));
    expect(() => likeToRegexp(null)).to.throw(error('null'));
    expect(() => likeToRegexp({})).to.throw(error('Object'));
  });

  describe('basic wildcards', function () {
    it('should handle "%" as zero or more characters', function () {
      const re = likeToRegexp('he%o');
      expect(re.test('hello')).to.be.true;
      expect(re.test('heo')).to.be.true;
      expect(re.test('hexxxxo')).to.be.true;
      expect(re.test('ahello')).to.be.false;
      expect(re.test('hellob')).to.be.false;
    });

    it('should handle "_" as exactly one character', function () {
      const re = likeToRegexp('he_lo');
      expect(re.test('hello')).to.be.true;
      expect(re.test('healo')).to.be.true;
      expect(re.test('he_lo')).to.be.true;
      expect(re.test('helo')).to.be.false;
      expect(re.test('helllo')).to.be.false;
    });

    it('should handle multiple wildcards', function () {
      const re = likeToRegexp('%_world%');
      expect(re.test('hello_world_today')).to.be.true;
      expect(re.test('a_world')).to.be.true;
      expect(re.test('no_match')).to.be.false;
    });
  });

  describe('case sensitivity', function () {
    it('should be case-sensitive by default', function () {
      const re = likeToRegexp('Hello%');
      expect(re.test('Hello World')).to.be.true;
      expect(re.test('hello World')).to.be.false;
    });

    it('should be case-insensitive when specified', function () {
      const re = likeToRegexp('Hello%', true);
      expect(re.test('Hello World')).to.be.true;
      expect(re.test('hello World')).to.be.true;
      expect(re.test('HELLO WORLD')).to.be.true;
    });
  });

  describe('escaping', function () {
    it('should handle escaped "%" as a literal character', function () {
      const re = likeToRegexp('100\\%');
      expect(re.test('100%')).to.be.true;
      expect(re.test('100_')).to.be.false;
    });

    it('should handle escaped "_" as a literal character', function () {
      const re = likeToRegexp('file\\_name');
      expect(re.test('file_name')).to.be.true;
      expect(re.test('filename')).to.be.false;
    });

    it('should handle escaped backslash as a literal backslash', function () {
      const re = likeToRegexp('path\\\\to\\\\file');
      expect(re.test('path\\to\\file')).to.be.true;
      expect(re.test('pathtofile')).to.be.false;
    });

    it('should handle a trailing backslash as a literal backslash', function () {
      const re = likeToRegexp('path\\');
      expect(re.test('path\\')).to.be.true;
      expect(re.test('path')).to.be.false;
    });

    it('should handle mixed escaping and wildcards', function () {
      const re = likeToRegexp('%file\\_%.docx');
      expect(re.test('my_awesome_file_v1.docx')).to.be.true;
      expect(re.test('my_awesome_file-v1.docx')).to.be.false;
    });
  });

  describe('escaping RegExp special character', function () {
    it('should escape dots "." as literal dots', function () {
      const re = likeToRegexp('v1.0');
      expect(re.test('v1.0')).to.be.true;
      expect(re.test('v1_0')).to.be.false;
    });

    it('should escape parentheses "()" as literals', function () {
      const re = likeToRegexp('file(1)');
      expect(re.test('file(1)')).to.be.true;
      expect(re.test('file1')).to.be.false;
    });

    it('should escape plus signs "+"', function () {
      const re = likeToRegexp('C++');
      expect(re.test('C++')).to.be.true;
      expect(re.test('C+')).to.be.false;
    });

    it('should escape question marks "?"', function () {
      const re = likeToRegexp('Are you sure?');
      expect(re.test('Are you sure?')).to.be.true;
      expect(re.test('Are you sure')).to.be.false;
    });

    it('should escape curly braces "{}"', function () {
      const re = likeToRegexp('{id}');
      expect(re.test('{id}')).to.be.true;
      expect(re.test('id')).to.be.false;
    });

    it('should handle a complex string with multiple special characters', function () {
      const pattern = 'docs\\(v1.0\\)/%.txt+';
      const re = likeToRegexp(pattern);
      expect(re.test('docs(v1.0)/document_v2.txt+')).to.be.true;
      expect(re.test('docs(v1.0)/document_v2.txt')).to.be.false;
    });
  });

  describe('full pattern matching', function () {
    it('should match the entire string, not just a part of it', function () {
      const re = likeToRegexp('world');
      expect(re.test('hello world')).to.be.false;
      expect(re.test('world today')).to.be.false;
      expect(re.test('world')).to.be.true;
    });

    it('should match the entire string when using wildcards at boundaries', function () {
      const re = likeToRegexp('%world%');
      expect(re.test('hello world')).to.be.true;
      expect(re.test('world today')).to.be.true;
      expect(re.test('hello world today')).to.be.true;
      expect(re.test('world')).to.be.true;
    });
  });
});
