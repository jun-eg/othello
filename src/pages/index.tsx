import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
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
      //確定返し駒リスト※y,xの順番で格納されてる
      let return_piece_list: number[][] = [];

      //対駒座標
      const same_piece: number[] = [];

      for (const course of directions) {
        //臨時返し駒リスト※y,xの順番で格納されてる
        const temporary_return_piece_list: number[][] = [];

        //1つ隣が異色駒の場合は、2つ以降の隣コマ参照
        if (board[y + course[1]][x + course[0]] === 3 - turnColor) {
          for (let next_squares = 2; next_squares <= 7; next_squares++) {
            const x_next_squares = course[0] * next_squares + assume_x;
            const y_next_squares = course[1] * next_squares + assume_y;

            //返し駒リスト格納
            temporary_return_piece_list.push([y_next_squares, x_next_squares]);

            if (
              //対駒の前に0が来たらbreak
              board[y_next_squares] !== undefined &&
              board[x_next_squares] !== undefined &&
              board[y_next_squares][x_next_squares] === 0
            ) {
              break;
            }

            if (board[y_next_squares][x_next_squares] === turnColor) {
              //対駒がある場合、臨時返し駒リストの座標をリスト
              return_piece_list = temporary_return_piece_list;

              //対駒座標取得
              same_piece.push(y_next_squares);
              same_piece.push(x_next_squares);

              break;
            }
          }
        }
      }

      return [same_piece, return_piece_list];
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
