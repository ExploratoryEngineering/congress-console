import { TagHelper } from 'Helpers/TagHelper';


describe('The tag helper', () => {
  let tagHelper;

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
});
