import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const [turnColor, setTurnColor] = useState(1);
  const clickCell = (x: number, y: number) => {
    console.log('クリック', x, y);
    const newBoard: number[][] = JSON.parse(JSON.stringify(board));

    console.log('newBoard', newBoard);
    const directions = [
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0],
      [-1, -1],
    ];

    //8方向を参照して対駒座標、返し駒座標リストを返す関数
    function look_around(assume_x: number, assume_y: number): [number[], number[][]] {
      //確定返し駒リスト※x,yの順番で格納されてる
      let return_piece_list: number[][] = [];

      //クリック座標
      let valid_click_state: number[] = [];

      for (const course of directions) {
        //臨時返し駒リスト※x,yの順番で格納されてる
        const temporary_return_piece_list: number[][] = [];

        //1つ隣が異色駒の場合は、2つ以降の隣コマ参照
        if (
          board[y + course[1]] !== undefined &&
          board[x + course[0]] !== undefined &&
          board[y + course[1]][x + course[0]] === 3 - turnColor
        ) {
          for (let next_squares = 2; next_squares <= 7; next_squares++) {
            const x_next_squares = course[0] * next_squares + assume_x;
            const y_next_squares = course[1] * next_squares + assume_y;

            //臨時返し駒リストへ格納※pushの順番注意
            temporary_return_piece_list.push([x_next_squares, y_next_squares]);

            if (
              //対駒の前に0が来たらbreak
              board[y_next_squares] !== undefined &&
              board[x_next_squares] !== undefined &&
              board[y_next_squares][x_next_squares] === 0
            ) {
              break;
            }

            if (
              board[y + course[1]] !== undefined &&
              board[x + course[0]] !== undefined &&
              board[y_next_squares][x_next_squares] === turnColor
            ) {
              //異色の場合、1つ隣のマスを臨時返し駒リストへ格納
              temporary_return_piece_list.push([assume_x + course[0], assume_y + course[1]]);

              //対駒がある場合、臨時返し駒リストの座標をリストへ
              return_piece_list = return_piece_list.concat(temporary_return_piece_list);

              //対駒が認識された場合、クリック座標を格納※x,yの順で格納
              valid_click_state = [assume_x, assume_y];

              break;
            }
          }
        }
      }

      return [valid_click_state, return_piece_list];
    }

    const [click, return_list] = look_around(x, y);

    // console.log('click', click === []);
    console.log('return_list', return_list, return_list[0], return_list[1]);
    if (
      board[click[1]] !== undefined &&
      board[click[0]] !== undefined &&
      board[click[1]][click[0]] === 0
    ) {
      newBoard[click[1]][click[0]] = turnColor;

      for (const one_return_list of return_list) {
        newBoard[one_return_list[1]][one_return_list[0]] = turnColor;
      }
      setTurnColor(3 - turnColor);
      setBoard(newBoard);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
              {cell !== 0 && cell !== 3 && (
                <div
                  className={styles.storn}
                  style={{ background: cell === 1 ? '#000' : '#fff' }}
                />
              )}

              {cell === 3 && <div className={styles.signpost} key={`${x}-${y}`} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
