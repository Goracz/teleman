import { memo } from 'react';

import {
    IconArrowLeft, IconArrowRight, IconArrowUp, IconChevronDown, IconMinus, IconPlus
} from '@tabler/icons-react';

import DashboardContainer from '../components/dashboard/DashboardContainer';
import Heading from '../components/layout/Heading';
import Button from '../components/layout/MenuButton/MenuButton';
import Card from '../components/ui/Card';
import { colors } from '../styles/colors';

const Dashboard: React.FC = memo(() => {
    return (
        <>
            <DashboardContainer>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>
                        <Heading title='TV' decoration='bg-accent' extraDecorationPath='/tv-decoration.svg' />
                        <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                            <div className='grid grid-cols-4 gap-8'>
                                <Card decorationColor={colors['accent-green']} active>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Status</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <Button title='Turn Off' link='#' variant="action" />
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='UP' decoration='bg-accent-green' />
                                    </Card.LowerRight>
                                </Card>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Uptime</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='2 hours' />
                                    </Card.LowerRight>
                                </Card>
                                <Card decorationColor={colors['accent-red']}>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Channel</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.UpperRight>
                                        <button type='button' className='focus:outline-dotted'>
                                            <IconChevronDown className='cursor-pointer' size={32} stroke={3} />
                                        </button>
                                    </Card.UpperRight>
                                    <Card.LowerLeft>
                                        <div className='grid grid-cols-2 gap-2'>
                                            <button type='button' className='focus:outline-dotted'>
                                                <IconArrowLeft className='cursor-pointer' size={24} stroke={3} />
                                            </button>
                                            <button type='button' className='focus:outline-dotted'>
                                                <IconArrowRight className='cursor-pointer' size={24} stroke={3} />
                                            </button>
                                        </div>
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                        <img src="/atv.png" alt="ATV" className='h-10 w-10' />
                                    </Card.LowerRight>
                                </Card>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Volume</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <div className='grid grid-cols-2 gap-4'>
                                            <button type='button' className='focus:outline-dotted'>
                                                <IconMinus className='cursor-pointer' size={20} stroke={4} />
                                            </button>
                                            <button type='button' className='focus:outline-dotted'>
                                                <IconPlus className='cursor-pointer' size={20} stroke={4} />
                                            </button>
                                        </div>
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='11' />
                                    </Card.LowerRight>
                                </Card>
                            </div>
                            <div className='grid grid-cols-4 gap-8'>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Digital Channels</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='123' />
                                    </Card.LowerRight>
                                </Card>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Analogue Channels</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='0' />
                                    </Card.LowerRight>
                                </Card>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>Radio Channels</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='3' />
                                    </Card.LowerRight>
                                </Card>
                                <Card>
                                    <Card.UpperLeft>
                                        <Card.Subtitle>LAN IP</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Heading size='sm' title='192.168.1.246' />
                                    </Card.LowerRight>
                                </Card>
                            </div>
                        </div>
                    </DashboardContainer.Card>
                    <DashboardContainer.Card>
                        <Heading title='Analytics' decoration='bg-accent-red' extraDecorationPath='/analytics-decoration.svg' />
                        <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                            <div className='grid grid-cols-2 gap-8'>
                                <Card size='lg' active>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>Most Used App</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <Card.Subtitle size='lg'>Tidal</Card.Subtitle>
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                    <Card.Subtitle size='lg'>
                                        <img src="/tidal.svg" alt="Tidal" className='h-16 w-16' />
                                    </Card.Subtitle>
                                    </Card.LowerRight>
                                </Card>
                                <Card size='lg'>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>Most Viewed Topic</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <Card.Subtitle size='lg'>Educational - 3 hours</Card.Subtitle>
                                    </Card.LowerLeft>
                                </Card>
                            </div>
                            <div className='grid grid-cols-2 gap-8'>
                                <Card size='lg' decorationColor={colors['accent-red']}>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>View Time</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <Card.Subtitle className='text-accent-red' size='lg'>+27% since last week</Card.Subtitle>
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                        <IconArrowUp className='text-accent-red' size={46} stroke={2} />
                                    </Card.LowerRight>
                                </Card>
                                <Card size='lg' decorationColor={colors['accent-green']}>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>Energy Savings</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerLeft>
                                        <Card.Subtitle className='text-accent-green' size='lg'>+200 W/h</Card.Subtitle>
                                    </Card.LowerLeft>
                                    <Card.LowerRight>
                                        <IconArrowUp className='text-accent-green' size={46} stroke={2} />
                                    </Card.LowerRight>
                                </Card>
                            </div>
                        </div>
                    </DashboardContainer.Card>
                </DashboardContainer.Row>
                <DashboardContainer.Row>
                    <DashboardContainer.Card>
                        <Heading title='Quick Launch' decoration='bg-accent-orange' extraDecorationPath='/quick-launch-decoration.svg' />
                        <div className='grid grid-rows-2 gap-10 py-8 px-4'>
                            <div className='grid grid-cols-2 gap-8'>
                                <Card size='lg' decorationColor={colors['accent-green']}>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>Spotify</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                    <Card.Subtitle size='lg'>
                                        <img src="/spotify.svg" alt="Spotify" className='h-16 w-16' />
                                    </Card.Subtitle>
                                    </Card.LowerRight>
                                </Card>
                                <Card size='lg'>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>Tidal</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <Card.Subtitle size='lg'>
                                        <img src="/tidal.svg" alt="Tidal" className='h-16 w-16' />
                                        </Card.Subtitle>
                                    </Card.LowerRight>
                                </Card>
                            </div>
                            <div className='grid grid-cols-2 gap-8'>
                                <Card size='lg' decorationColor={colors['accent-red']} active>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>YouTube</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.UpperRight>
                                        <Card.Subtitle size='lg'>
                                            <img src="/youtube.svg" alt="YouTube" className='h-11 w-16 mr-2.5' />
                                        </Card.Subtitle>
                                    </Card.UpperRight>
                                    <Card.LowerRight>
                                        <Button title='Open ->' variant='action' className='py-2 px-3 mb-3 mr-2' />
                                    </Card.LowerRight>
                                </Card>
                                <Card size='lg' decorationColor={colors['accent-red']}>
                                    <Card.UpperLeft>
                                        <Card.Subtitle size='lg'>NetFlix</Card.Subtitle>
                                    </Card.UpperLeft>
                                    <Card.LowerRight>
                                        <img src="/netflix.svg" alt="NetFlix" className='h-16 w-16' />
                                    </Card.LowerRight>
                                </Card>
                            </div>
                        </div>
                    </DashboardContainer.Card>
                    <DashboardContainer.Card>
                        <Heading title='Insights' decoration='bg-accent-purple' extraDecorationPath='/insights-decoration.svg' />
                        <div className='grid grid-cols-2 gap-8'>
                            <div></div>
                            <Card className="p-10" size='full' active decorationColor={colors.accent}>
                                <Card.UpperLeft>
                                    <Card.Subtitle size='lg'>View Time</Card.Subtitle>
                                </Card.UpperLeft>
                                <Card.LowerLeft>
                                    <Card.Subtitle size='lg'>
                                        All Time
                                    </Card.Subtitle>
                                </Card.LowerLeft>
                                <Card.LowerRight>
                                    <Card.Subtitle size='lg'>
                                        1,270 hours
                                    </Card.Subtitle>
                                </Card.LowerRight>
                            </Card>
                        </div>
                    </DashboardContainer.Card>
                </DashboardContainer.Row>
            </DashboardContainer>
        </>
    );
});

export default Dashboard;
