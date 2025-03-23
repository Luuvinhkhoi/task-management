import React from 'react';
import Timeline from 'react-calendar-timeline';
import moment from 'moment';
import './timeline.scss';
import './timeline.css';

const groups = [
  { id: 1, title: 'Interview' },
  { id: 2, title: 'Ideate' },
  { id: 3, title: 'Wireframe' },
  { id: 4, title: 'Evaluate' }
];

const items = [
  {
    id: 1,
    group: 1,
    start_time: moment().add(0, 'days').startOf('day').add(9, 'hours'),
    end_time: moment().add(1, 'days').startOf('day').add(11, 'hours'),
    canMove: true,
    canResize: 'both'
  },
  {
    id: 2,
    group: 2,
    start_time: moment().add(1, 'days').startOf('day').add(10, 'hours'),
    end_time: moment().add(3, 'days').startOf('day').add(14, 'hours')
  },
  {
    id: 3,
    group: 3,
    start_time: moment().add(2, 'days').startOf('day').add(11, 'hours'),
    end_time: moment().add(4, 'days').startOf('day').add(13, 'hours')
  },
  {
    id: 4,
    group: 4,
    start_time: moment().add(1, 'days').startOf('day').add(8, 'hours'),
    end_time: moment().add(5, 'days').startOf('day').add(16, 'hours')
  }
];

export const TimelineElement = () => {
  return (
    <div id='timeline'>
      <h3 style={{textAlign:'start'}}>Timline</h3>
      <Timeline
        groups={groups}
        items={items}
        defaultTimeStart={moment().startOf('day')}
        defaultTimeEnd={moment().add(7, 'days').endOf('day')}
        lineHeight={45}
        itemRenderer={({ item, getItemProps, itemContext }) => {
          console.log('Rendering item:', item);
          const props = getItemProps(); 
          return (
            <div
              {...props} // các props timeline cần
              data-id={item.id} // thêm thủ công vào DOM
            >
              <div className="rct-item-content">{item.title}</div>
            </div>
          );
        }}
      />
    </div>
  );
};
