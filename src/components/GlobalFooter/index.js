import React from 'react';
import classNames from 'classnames';
import style from './index.module.less';

const GlobalFooter = ({ className, links, copyright }) => {
    const clsString = classNames(style.globalFooter, className);
    return (
        <div className={clsString}>
            {links && (
                <div>
                    {links.map(link => (
                        <a
                            key={link.key}
                            target={link.blankTarget ? '_blank' : '_self'}
                            href={link.href}
                        >
                            {link.title}
                        </a>
                    ))}
                </div>
            )}
            {copyright && <div className={style.copyright}>{copyright}</div>}
        </div>
    );
};

export default GlobalFooter;
