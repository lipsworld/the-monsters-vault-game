import styles from './box.css';
import React, { PropTypes } from 'react';
import Plain from '../plain/plain';
import { getTransformRule, createPanner } from '../../lib/utils';

const INHABITED_MODE = {
    1: 'clawsOnWood',
    2: 'breathing'
};

class Box extends React.PureComponent {
    static propTypes = {
        name: PropTypes.string.isRequired,
        pos: PropTypes.arrayOf(PropTypes.number).isRequired,
        playerPos: PropTypes.arrayOf(PropTypes.number).isRequired,
        size: PropTypes.arrayOf(PropTypes.number).isRequired,
        mode: PropTypes.number.isRequired,
        graphicsQuality: PropTypes.number.isRequired
    };
    static contextTypes = {
        audioCtx: PropTypes.object.isRequired,
        masterGain: PropTypes.object.isRequired,
        assets: PropTypes.object.isRequired
    };

    constructor(props, context) {
        super(props, context);

        this.posWithInvertedY = [props.pos[0], -props.pos[1], props.pos[2]];
        this.styleRules = getTransformRule({ pos: this.posWithInvertedY });

        if (props.inhabited) {
            this.inhabitedAutioBuffer = this.context.assets[
                `src/components/box/${INHABITED_MODE[props.inhabited]}.m4a`
            ];
            this.breakAudioBuffer = this.context.assets['src/components/box/breakBox.m4a'];
            this.laughAudioBuffer = this.context.assets['src/components/box/growl.m4a'];

            this.audioSource = null;

            this.inhabitedPanner = createPanner({
                audioCtx: this.context.audioCtx,
                distanceModel: 'linear',
                refDistance: props.size[0] / 2,
                maxDistance: props.size[0] * 3,
                pos: props.pos
            });
            this.inhabitedPanner.connect(this.context.masterGain);

            this.breakPanner = createPanner({
                audioCtx: this.context.audioCtx,
                pos: props.pos
            });
            this.breakPanner.connect(this.context.masterGain);

            this.soundStart({
                buffer: this.inhabitedAutioBuffer,
                destination: this.inhabitedPanner,
                loop: true
            });
        }
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isBroken && nextProps.isBroken) {
            this.soundStop();
            this.soundStart({
                buffer: this.breakAudioBuffer,
                destination: this.breakPanner
            });
            setTimeout(() => {
                this.soundStop();
                this.soundStart({
                    buffer: this.laughAudioBuffer,
                    destination: this.breakPanner
                });
            }, 2000);
        }
    }

    componentWillUnmount() {
        this.soundStop();
    }

    render() {
        const { isVisible, isBroken, name, pos, playerPos, size, mode, graphicsQuality } = this.props;
        if (!isVisible) {
            return null;
        }

        const className = [
            'obj',
            styles['mode-' + mode],
            styles['quality-' + graphicsQuality],
            isBroken ? styles.broken : ''
        ].join(' ');

        // Front-Back-Left-Right-Top
        return <div className={className} style={this.styleRules}>
            <Plain
                id={name + '-0'}
                pos={[0, 0, size[2] / 2]}
                parentPos={[this.posWithInvertedY]}
                playerPos={playerPos}
                size={size}
                angle={[0, 0, 0]}
                patternId={'box0' + mode}
                graphicsQuality={graphicsQuality}
            />
            <Plain
                id={name + '-1'}
                pos={[0, 0, -size[2] / 2]}
                parentPos={[this.posWithInvertedY]}
                playerPos={playerPos}
                size={size}
                angle={[0, 180, 0]}
                patternId={'box0' + mode}
                graphicsQuality={graphicsQuality}
            />
            <Plain
                id={name + '-2'}
                pos={[-size[0] / 2, 0, 0]}
                parentPos={[this.posWithInvertedY]}
                playerPos={playerPos}
                size={[size[2], size[1]]}
                angle={[0, -90, 0]}
                patternId={'box0' + mode}
                graphicsQuality={graphicsQuality}
            />
            <Plain
                id={name + '-3'}
                pos={[size[0] / 2, 0, 0]}
                parentPos={[this.posWithInvertedY]}
                playerPos={playerPos}
                size={[size[2], size[1]]}
                angle={[0, 90, 0]}
                patternId={'box0' + mode}
                graphicsQuality={graphicsQuality}
            />
            {playerPos[1] > pos[1] + size[1] / 2
                ? <Plain
                    id={name + '-4'}
                    pos={[0, -size[1] / 2, 0]}
                    parentPos={[this.posWithInvertedY]}
                    playerPos={playerPos}
                    size={[size[0], size[2]]}
                    angle={[90, 0, 0]}
                    patternId={'box0' + mode}
                    graphicsQuality={graphicsQuality}
                />
                : null
            }
            {isBroken
                ? <Plain
                    className={styles.bottom}
                    id={name + '-5'}
                    pos={[0, size[1] / 2 - 1, 0]}
                    parentPos={[this.posWithInvertedY]}
                    playerPos={playerPos}
                    size={[size[0], size[2]]}
                    angle={[90, 0, 0]}
                    patternId={'box0' + mode}
                    graphicsQuality={graphicsQuality}
                />
                : null
            }
        </div>
    }

    soundStart({ buffer, destination, loop = false }) {
        this.audioSource = this.context.audioCtx.createBufferSource();
        this.audioSource.connect(destination);
        this.audioSource.buffer = buffer;
        this.audioSource.loop = loop;
        this.audioSource.start(0);
    }

    soundStop() {
        if (this.audioSource) {
            this.audioSource.stop();
            this.audioSource.disconnect();
            this.audioSource = null;
        }
    }
}

export default Box;
