import {expect} from 'chai';
import {modelNameToModelKey} from './model-name-to-model-key.js';

describe('modelNameToModelKey', function () {
  it('should return a simple lowercase string as is', function () {
    expect(modelNameToModelKey('user')).to.be.eq('user');
  });

  it('should convert to lowercase and remove hyphens and underscores', function () {
    const modelNames = [
      'userProfileDetails',
      'UserProfileDetails',
      'user-profile-details',
      'user_profile_details',
      'User-Profile-Details',
      'User_Profile_Details',
      'USER-PROFILE-DETAILS',
      'USER_PROFILE_DETAILS',
      'USERPROFILEDETAILS',
      'userprofiledetails',
    ];
    modelNames.forEach(v =>
      expect(modelNameToModelKey(v)).to.be.eq('userprofiledetails'),
    );
  });

  it('should handle a mixed string with uppercase, hyphens and underscores', function () {
    const modelName = 'User_Profile-Details';
    const expected = 'userprofiledetails';
    expect(modelNameToModelKey(modelName)).to.be.eq(expected);
  });

  it('should not remove numbers from the string', function () {
    const modelName = 'Type1-Model_2';
    const expected = 'type1model2';
    expect(modelNameToModelKey(modelName)).to.be.eq(expected);
  });

  it('should throw an error for an empty string', function () {
    const throwable = () => modelNameToModelKey('');
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but "" was given.',
    );
  });

  it('should throw an error for a string with spaces', function () {
    const throwable = () => modelNameToModelKey('user profile');
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but "user profile" was given.',
    );
  });

  it('should throw an error for null', function () {
    const throwable = () => modelNameToModelKey(null);
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but null was given.',
    );
  });

  it('should throw an error for undefined', function () {
    const throwable = () => modelNameToModelKey(undefined);
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but undefined was given.',
    );
  });

  it('should throw an error for a number', function () {
    const throwable = () => modelNameToModelKey(123);
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but 123 was given.',
    );
  });

  it('should throw an error for an object', function () {
    const throwable = () => modelNameToModelKey({name: 'test'});
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but Object was given.',
    );
  });

  it('should throw an error for an array', function () {
    const throwable = () => modelNameToModelKey(['test']);
    expect(throwable).to.throw(
      'The model name should be a non-empty String ' +
        'without spaces, but Array was given.',
    );
  });
});
