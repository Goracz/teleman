import React, { forwardRef } from 'react';
import { Group, Avatar, Text, Select, Indicator } from '@mantine/core';

const data: { image: string; label: string; value: string }[] = [
  // {
  //   image:
  //     'https://www.lg.com/hu/images/televiziok/md07546714/gallery/lg-tv-OLED42C24LA-medium01.jpg',
  //   label: 'LG C2 42"',
  //   value: 'LG C2',
  // },
  // {
  //   image: 'https://www.lg.com/eg_en/images/tvs/md07551843/gallery/D-01v.jpg',
  //   label: 'LG G2 55"',
  //   value: 'LG G2',
  // },
];

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  image: string;
  label: string;
  description: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
  ({ image, label, description, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Indicator inline size={10} offset={0} position="middle-start" color="teal">
        <Group noWrap>
          <Avatar src={image} />
          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" color="dimmed">
              {description}
            </Text>
          </div>
        </Group>
      </Indicator>
    </div>
  )
);

export const DropdownWithIcon = () => (
  <Select
    placeholder="TV"
    itemComponent={SelectItem}
    data={data}
    searchable
    maxDropdownHeight={400}
    nothingFound="No such TV found"
    filter={(value, item) => item.label!.toLowerCase().includes(value.toLowerCase().trim())}
  />
);
