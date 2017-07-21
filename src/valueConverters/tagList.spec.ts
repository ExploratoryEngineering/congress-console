import { TagListValueConverter } from 'valueConverters/tagList';

const tagList = new TagListValueConverter();

describe('Tag list value converter', () => {
  it('should correctly return tags based on tag entity', () => {
    const tagEntity: TagEntity = {
      tags: {
        name: 'testname'
      }
    };

    expect(tagList.toView(tagEntity.tags)).toContainEqual({
      key: 'name',
      value: 'testname'
    });
  });

  it('should correctly exclude tags based on filter', () => {
    const tagEntity: TagEntity = {
      tags: {
        name: 'testname'
      }
    };

    expect(tagList.toView(tagEntity.tags, ['name'])).not.toContainEqual({
      key: 'name',
      value: 'testname'
    });
  });
});
