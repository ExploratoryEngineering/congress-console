import { LogBuilder } from 'Helpers/LogBuilder';
import { TagHelper } from 'Helpers/TagHelper';
import { EventAggregator } from 'aurelia-event-aggregator';
import { autoinject, bindable, bindingMode } from 'aurelia-framework';

const th = new TagHelper();
const Log = LogBuilder.create('Edit tag chip');

interface Tag {
  name: string;
  key: string;
}

@autoinject
export class EditTagChip {
  editing: boolean = false;

  @bindable
  tag: Tag = {
    key: '',
    name: ''
  };
  @bindable
  model: TagEntity;
  @bindable
  namespace: string = '';

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  chipClicked(e: Event) {
    e.stopPropagation();
  }

  toggleEditing() {
    this.editing = !this.editing;
  }

  submitTag() {
    try {
      this.eventAggregator.publish(`${this.namespace}:tag:edit`, {
        model: this.model,
        tag: this.tag
      });
    } catch (err) {
      this.eventAggregator.publish('global:message', { body: err, timeout: 5000 });
    }
  }

  deleteTag() {
    Log.debug('Event emitting', `${this.namespace}:tag:delete`, {
      model: this.model,
      tag: this.tag
    });
    this.eventAggregator.publish(`${this.namespace}:tag:delete`, {
      model: this.model,
      tag: this.tag
    });
  }
}
