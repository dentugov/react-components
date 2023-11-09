import React from 'react';
import { Button } from '@consta/uikit/Button';
import { IconArrowRight } from '@consta/uikit/IconArrowRight';
import { IconArrowLeft } from '@consta/uikit/IconArrowLeft';
import debounce from 'lodash.debounce';
import style from './HorizontalScrollableBox.module.scss';

const HorizontalScrollableBox: React.FC = ({ children }) => {
  const [canScrollLeft, setCanScrollLeft] = React.useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = React.useState<boolean>(false);

  const scrollableRef = React.useRef<HTMLDivElement>(null);

  const checkForScrollPosition = () => {
    const { current } = scrollableRef;

    if (current) {
      const { scrollLeft, scrollWidth, clientWidth } = current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft !== scrollWidth - clientWidth);
    }
  };

  const debounceCheckForScrollPosition = debounce(checkForScrollPosition, 200);

  const scrollContainerBy = (distance: number) => scrollableRef.current?.scrollBy({ left: distance, behavior: 'smooth' });

  React.useEffect(
    () => {
      const { current } = scrollableRef;
      checkForScrollPosition();
      current?.addEventListener('scroll', debounceCheckForScrollPosition);

      return () => {
        current?.removeEventListener('scroll', debounceCheckForScrollPosition);
        debounceCheckForScrollPosition.cancel();
      };
    },
    []
  )

  return (
    <div className={style.wrapper}>

      <div className={style.scrollableContainer} ref={scrollableRef}>
        {children}
      </div>

      {canScrollLeft &&
        <Button
          className={`${style.button} ${style.buttonLeft}`}
          form="brick"
          iconLeft={IconArrowLeft}
          label="Назад"
          onClick={() => scrollContainerBy(-400)}
          onlyIcon
          size="xs"
          view="clear"
        />}

      {canScrollRight &&
        <Button
          className={`${style.button} ${style.buttonRight}`}
          form="brick"
          iconLeft={IconArrowRight}
          label="Вперед"
          onClick={() => scrollContainerBy(400)}
          onlyIcon
          size="xs"
          view="clear"
        />}
    </div>
  )
}

export default HorizontalScrollableBox;
