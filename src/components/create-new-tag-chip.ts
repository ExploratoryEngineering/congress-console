import { autoinject, bindable } from 'aurelia-framework';
import { LogBuilder } from 'Helpers/LogBuilder';
import { TagHelper } from 'Helpers/TagHelper';
import { EventAggregator } from 'aurelia-event-aggregator';

const th = new TagHelper();

const Log = LogBuilder.create('Create new tag chip');

@autoinject
export class CreateNewTagChip {
  editing: boolean = false;
  tag: Tag = {
    key: '',
    value: ''
  };

  @bindable
  model: any;

  @bindable
  namespace: string = '';

  inputElement: HTMLInputElement;

  constructor(
    private eventAggregator: EventAggregator
  ) { }

  chipClicked(e: Event) {
    e.stopPropagation();
  }

  toggleEditing() {
    this.editing = !this.editing;

    if (this.editing) {
      this.tag.key = '';
      this.tag.value = '';
    }
  }

  submitTag() {
    Log.debug('Event emitting', {
      model: this.model,
      tag: this.tag
    });
    this.eventAggregator.publish(`${this.namespace}:tag:new`, {
      model: this.model,
      tag: this.tag
    });
    this.toggleEditing();
  }
}
