import { IconArrowDown, IconArrowLeft, IconArrowUp } from '@tabler/icons-react';

import { useValueDirectionTextDecorationClasses } from '../../../hooks/dashboard/analytics-card';
import { ValueDirection } from '../../../models/tv/common/value-direction';

interface ValueDirectionIndicatorProps {
    direction: ValueDirection;
    negateDirection?: boolean;
    [prop: string]: any;
};

const IconComponents = {
    'up': IconArrowUp,
    'down': IconArrowDown,
    'default': IconArrowLeft,
};

export const ValueDirectionIndicator: React.FC<ValueDirectionIndicatorProps> = ({ direction, negateDirection, className, ...props }) => {
    const valueDirectionTextDecorationClasses = useValueDirectionTextDecorationClasses(direction, negateDirection);
    const IconComponent = IconComponents[direction] || IconComponents['default'];
    return <IconComponent size={46} stroke={2} className={`${valueDirectionTextDecorationClasses} ${className}`}  {...props} />;
};
