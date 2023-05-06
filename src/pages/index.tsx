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
  let newTurnColor = JSON.parse(JSON.stringify(turnColor));
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

    console.log('turncolor', turnColor);
    console.log('newturncolor', newTurnColor);
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
          console.log('隣異色０座標', assume_x, assume_y, course[0], course[1]);
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
              board[y_next_squares] !== undefined &&
              board[x_next_squares] !== undefined &&
              board[y_next_squares][x_next_squares] === turnColor
            ) {
              //異色の場合、1つ隣のマスを臨時返し駒リストへ格納
              temporary_return_piece_list.push([assume_x + course[0], assume_y + course[1]]);

              //対駒がある場合、臨時返し駒リストの座標をリストへ
              return_piece_list = return_piece_list.concat(temporary_return_piece_list);

              //対駒が認識された場合、クリック座標を格納※x,yの順で格納
              valid_click_state = [assume_x, assume_y];

              newTurnColor = 3 - turnColor;

              break;
            }
          }
        }
      }

      return [valid_click_state, return_piece_list];
    }

    //turncolorが変わったら行う処理
    //過去の黄色枠座標消去
    if (newTurnColor === 3 - turnColor) {
      for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
          if (newBoard[j][i] === 7) {
            newBoard[j][i] = 0;
          }
        }
      }
    }

    //有効クリック駒設置、駒返し処理
    const [click, return_list] = look_around(x, y);
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

      setBoard(newBoard);
      setTurnColor(newTurnColor);
    }

    //ゼロ座標全検索
    const zero_positions: number[][] = [];
    for (let zy = 0; zy < newBoard.length; zy++) {
      for (let zx = 0; zx < newBoard[zy].length; zx++) {
        if (newBoard[zy][zx] === 0) {
          const f_zero_positions: number[] = [];
          f_zero_positions.push(zx);
          f_zero_positions.push(zy);
          console.log('f_zero_position', f_zero_positions);
          zero_positions.push(f_zero_positions);
          console.log('zero_position', zero_positions);
          //注意！zero_positionsは、x,yの順で格納されている
        }
      }
    }

    for (const one_zero_position of zero_positions) {
      const [valid_one_zero_position] = look_around(one_zero_position[0], one_zero_position[1]);

      console.log('valid_one_zero_position', valid_one_zero_position);
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
