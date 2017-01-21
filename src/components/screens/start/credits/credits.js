import styles from './credits.css';
import React from 'react';
import ExternalLink from '../externalLink/externalLink';

export default function Credits() {
    return <dl className={styles.creditsList}>
        <dt>Textures</dt>
        <dd className={styles.creditsDescription}>
            <ExternalLink href='https://freestocktextures.com/' />
            <br />
            by&nbsp;
            <ExternalLink href='https://twitter.com/pinkonhead'>
                @PinkOnHead
            </ExternalLink>
            &nbsp;and&nbsp;
            <ExternalLink href='https://twitter.com/PawelWoz'>
                @PawelWoz
            </ExternalLink>
        </dd>
        <dt>Sound effects</dt>
        <dd className={styles.creditsDescription}>
            steps, doors —
            <br />
            <ExternalLink href='http://www.bigsoundbank.com/' />
            <br />
            by&nbsp;
            <ExternalLink href='https://twitter.com/josephsardin'>
                @josephsardin
            </ExternalLink>
            <br />
            <br />
            breaking boxes, growls —
            <br />
            <ExternalLink href='http://opengameart.org/' />
            <br />
            by&nbsp;
            <ExternalLink href='https://twitter.com/opengameart'>
                @opengameart
            </ExternalLink>
        </dd>
        <dt>Xbox controller driver for MacOs</dt>
        <dd className={styles.creditsDescription}>
            <ExternalLink href='https://github.com/360Controller/360Controller'>
                360Controller on GitHub
            </ExternalLink>
        </dd>
        <dt>
            <ExternalLink href='https://github.com/alvov/doors-and-levers-game'>
                Github Repo
            </ExternalLink>
        </dt>
    </dl>;
}
