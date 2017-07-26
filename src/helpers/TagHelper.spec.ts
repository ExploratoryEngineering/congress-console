import { TagHelper } from 'Helpers/TagHelper';


describe('The tag helper', () => {
  let tagHelper: TagHelper;

  beforeEach(() => {
    tagHelper = new TagHelper();
  });

  describe('name tag', () => {
    it('should return the name of the entity if tag is present and no fallback', () => {
      const entityWithTagName = {
        tags: {
          name: 'Testname'
        }
      };

      expect(tagHelper.getEntityName(entityWithTagName)).toBe('Testname');
    });

    it('should return the fallback prop if name tag is not found', () => {
      const entityWithoutTagNameButFallback = {
        tags: {},
        fallback: 'Testfallback'
      };

      expect(tagHelper.getEntityName(entityWithoutTagNameButFallback, 'fallback')).toBe('Testfallback');
    });

    it('should return the fallback if name tag does not exist and no fallback', () => {
      const entityWithoutTagNameAndNoFallback = {
        tags: {}
      };

      expect(tagHelper.getEntityName(entityWithoutTagNameAndNoFallback)).toBe(tagHelper.TAG_NAME_FALLBACK_VALUE);
    });

    it('should return the fallback if name tag does not exist and undefined fallback', () => {
      const entityWithoutTagNameAndNoFallback = {
        tags: {}
      };

      expect(tagHelper.getEntityName(entityWithoutTagNameAndNoFallback, 'nonExistantFallback')).toBe(tagHelper.TAG_NAME_FALLBACK_VALUE);
    });
  });

  describe('description tag', () => {
    it('should return the description of the entity if tag is present and no fallback', () => {
      const entityWithTagDescription = {
        tags: {
          description: 'Description'
        }
      };

      expect(tagHelper.getEntityDescription(entityWithTagDescription)).toBe('Description');
    });

    it('should return the fallback prop if description tag is not found', () => {
      const entityWithoutTagDescriptionButFallback = {
        tags: {},
        fallback: 'Testfallback'
      };

      expect(tagHelper.getEntityName(entityWithoutTagDescriptionButFallback, 'fallback')).toBe('Testfallback');
    });

    it('should return the fallback if description tag does not exist and no fallback', () => {
      const entityWithoutTagDescriptionAndNoFallback = {
        tags: {}
      };

      expect(tagHelper.getEntityDescription(entityWithoutTagDescriptionAndNoFallback)).toBe(tagHelper.TAG_DESCRIPTION_FALLBACK_VALUE);
    });

    it('should return the fallback if description tag does not exist and undefined fallback', () => {
      const entityWithoutTagDescriptionAndNoFallback = {
        tags: {}
      };

      expect(tagHelper.getEntityDescription(entityWithoutTagDescriptionAndNoFallback, 'nonExistantFallback')).toBe(tagHelper.TAG_DESCRIPTION_FALLBACK_VALUE);
    });
  });

  describe('parsing string to Tag', () => {
    it('should correctly parse a semicolon separated string to tag', () => {
      expect(tagHelper.parseStringToTag('tagKey:tagValue')).toEqual({
        key: 'tagKey',
        value: 'tagValue'
      });
    });

    it('should allow for spaces in tag key', () => {
      expect(JSON.stringify(tagHelper.parseStringToTag('testing space in key:tagValue'))).toBe(JSON.stringify({
        key: 'testing space in key',
        value: 'tagValue'
      }));
    });

    it('should allow for spaces in tag value', () => {
      expect(JSON.stringify(tagHelper.parseStringToTag('tagKey:testing with space in tagValue'))).toBe(JSON.stringify({
        key: 'tagKey',
        value: 'testing with space in tagValue'
      }));
    });
  });

  describe('parse Tag to string', () => {
    it('should correctly parse a Tag to string format', () => {
      let tag: Tag = { key: 'tagKey', value: 'tagValue' };
      const tagString = tagHelper.parseTagToString(tag);

      expect(tagString).toEqual('tagKey:tagValue');
    });
  });

  describe('get tags from object', () => {
    it('should return an empty array if no tags in object', () => {
      let tagObject: TagObject = {};
      const tags: Tag[] = tagHelper.getTagsFromObject(tagObject);

      expect(tags.length).toBe(0);
    });

    it('should correctly return a single tag from object', () => {
      let tagObject: TagObject = {
        test: 'test'
      };
      const tags: Tag[] = tagHelper.getTagsFromObject(tagObject);

      expect(tags.length).toBe(1);
      expect(tags).toContainEqual({
        key: 'test',
        value: 'test'
      });
    });

    it('should correctly return multiple tags from object', () => {
      let tagObject: TagObject = {
        test: 'test',
        test2: 'test2'
      };
      const tags: Tag[] = tagHelper.getTagsFromObject(tagObject);
      expect(tags.length).toBe(2);
      expect(tags).toContainEqual({
        key: 'test',
        value: 'test'
      });
      expect(tags).toContainEqual({
        key: 'test2',
        value: 'test2'
      });
    });
  });
  describe('regex', () => {
    let regex: RegExp;
    beforeAll(() => {
      regex = tagHelper.getTagRegEx();
    });
    it('should correctly accept lower case letters', () => {
      expect(regex.test('abc')).toBe(true);
    });
    it('should correctly accept upper case letters', () => {
      expect(regex.test('ABC')).toBe(true);
    });
    it('should correctly accept numbers', () => {
      expect(regex.test('123')).toBe(true);
    });
    it('should correctly accept underscore', () => {
      expect(regex.test('_')).toBe(true);
    });
    it('should correctly accept plus sign', () => {
      expect(regex.test('+')).toBe(true);
    });
    it('should correctly accept minus sign', () => {
      expect(regex.test('-')).toBe(true);
    });
    it('should correctly accept punctuation', () => {
      expect(regex.test('.')).toBe(true);
    });
    it('should correctly accept comma', () => {
      expect(regex.test(',')).toBe(true);
    });
    it('should correctly accept colon', () => {
      expect(regex.test(':')).toBe(true);
    });
    it('should correctly accept semi colon', () => {
      expect(regex.test(';')).toBe(true);
    });
    it('should accept spaces in tag', () => {
      expect(regex.test('test space')).toBe(true);
    });

    it('should correctly not accept UTF-8', () => {
      expect(regex.test('æøå')).toBe(false);
    });
  });
});
