import React, { Fragment } from 'react';
import { Observer } from 'mobx-react-lite';
import BookItem from './BookItem';
import SongItem from '../SongItem';
import ImageItem from './ImageItem/';
import ArticleItem from './ArticleItem';
import VideoItem from './VideoItem';
import ComicItem from './ComicItem';

export default function ResourceItem({
  item,
  loader,
  display = 1,
  type,
  ...props
}) {
  // display: 1 左图右文 2 左文右图 3 上图下文
  if (!type) {
    type = item.source_type || item.type;
  }
  return (
    <Observer>
      {() => {
        let Item = <ArticleItem item={item} loader={loader} />;
        switch (type) {
          case 'novel':
            Item = <BookItem item={item} loader={loader} />;
            break;
          case 'image':
            Item = <ImageItem display={display} item={item} loader={loader} />;
            break;
          case 'music':
            Item = (
              <SongItem
                item={item}
                loader={loader}
                mode=""
                {...props}
                position="picker"
              />
            );
            break;
          case 'article':
            Item = <ArticleItem item={item} loader={loader} />;
            break;
          case 'news':
            Item = <ArticleItem item={item} loader={loader} />;
            break;
          case 'video':
            Item = (
              <VideoItem
                item={item}
                display={display}
                loader={loader}
                {...props}
              />
            );
            break;
            case 'animation':
              Item = (
                <VideoItem
                  item={item}
                  display={display}
                  loader={loader}
                  {...props}
                />
              );
              break;
              case 'movie':
                Item = (
                  <VideoItem
                    item={item}
                    display={display}
                    loader={loader}
                    {...props}
                  />
                );
                break;
          case 'comic':
            Item = <ComicItem item={item} loader={loader} />;
            break;
          default:
            break;
        }
        return Item;
      }}
    </Observer>
  );
}
