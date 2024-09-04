'use client';

import React from 'react';
import block from 'bem-cn-lite';
import { Button, Icon } from '@gravity-ui/uikit';
import { BookOpen, ListCheck } from '@gravity-ui/icons';


import './InfoButtons.scss';

const b = block('info-buttons');

export const InfoButtons: React.FC = () => {
    return (
        <div className={b()}>
            <div className={b('block')}>
                <div className={b('title')}>Changelog</div>
                <div className={b('buttons')}>
                    <div className={b('button')}>
                        <Button
                            size="l"
                            disabled
                            view="outlined"
                            href="https://nextjs.org/docs"
                            target="_blank"
                        >
                            <Icon data={BookOpen} />
                            Docs
                        </Button>
                    </div>
                    <div className={b('button')}>
                        <Button
                            size="l"
                            view="outlined"
                            href="/changelog"
                            target="_blank"
                        >
                            <Icon data={ListCheck} />
                            Changelog
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
