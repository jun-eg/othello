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

  const newBoard: number[][] = JSON.parse(JSON.stringify(board));

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

  const [turnColor, setTurnColor] = useState(1);
  let newTurnColor = JSON.parse(JSON.stringify(turnColor));

  const [white_count, setwhite_count] = useState(2);
  let newwhite_count = JSON.parse(JSON.stringify(white_count));

  const [black_count, setblack_count] = useState(2);
  let newblack_count = JSON.parse(JSON.stringify(black_count));

  const [black_pass_count, setblack_pass_count] = useState(0);
  let newblack_pass_count = JSON.parse(JSON.stringify(black_pass_count));

  const [white_pass_count, setwhite_pass_count] = useState(0);
  let newwhite_pass_count = JSON.parse(JSON.stringify(white_pass_count));

  //0座標取得(候補地設置に使用)
  const get_zero_positions = () => {
    const zero_positions: number[][] = [];
    board.map((y, rowIndex_y) => {
      y.map((x, colIndex_x) => {
        if (x === 0) {
          zero_positions.push([rowIndex_y, colIndex_x]);
        }
      });
    });
    return zero_positions;
  };

  //過去の黄色枠座標消去

  for (let i = 0; i < newBoard.length; i++) {
    for (let j = 0; j < newBoard[i].length; j++) {
      if (board[j][i] === 7) {
        board[j][i] = 0;
      }
    }
  }

  //隣が異色の場合、対ゴマ探しor候補地選出
  const serch_turn_color = (a_position: number[], one_direction: number[], count: number) => {
    if (
      board[a_position[0] + one_direction[0]]?.[a_position[1] + one_direction[1]] ===
        3 - turnColor &&
      board[a_position[0] + one_direction[0] * count]?.[
        a_position[1] + one_direction[1] * count
      ] === turnColor
    ) {
      const yellow_position: number[] = [a_position[0], a_position[1]];
      const taigoma_positions: number[] = [
        a_position[0] + one_direction[0] * count,
        a_position[1] + one_direction[1] * count,
      ];
      board[a_position[0]][a_position[1]] = 7;
      return { yellow_position, taigoma_positions };
    } else if (
      board[a_position[0] + one_direction[0] * count]?.[
        a_position[1] + one_direction[1] * count
      ] ===
      3 - turnColor
    ) {
      count++;
      serch_turn_color(a_position, one_direction, count);
    }
  };

  for (const n of get_zero_positions()) {
    for (const i of directions) {
      serch_turn_color(n, i, 2);
    }
  }

  const clickCell = (x: number, y: number) => {
    console.log('クリック', x, y);

    // console.log('newBoard', newBoard);

    // console.log('turncolor', turnColor);
    // console.log('newturncolor', newTurnColor);
    //8方向を参照して対駒座標、返し駒座標リストを返す関数
    function look_around(x: number, y: number): [number[], number[][]] {
      //確定返し駒リスト※x,yの順番で格納されてる
      let return_piece_list: number[][] = [];

      //クリック座標F
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
          // console.log('隣異色０座標', x, y, course[0], course[1]);
          for (let next_squares = 2; next_squares <= 7; next_squares++) {
            const x_next_squares = course[0] * next_squares + x;
            const y_next_squares = course[1] * next_squares + y;

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
              //対駒がある場合、1つ隣のマスを臨時返し駒リストへ格納
              temporary_return_piece_list.push([x + course[0], y + course[1]]);

              //対駒がある場合、臨時返し駒リストの座標をリストへ
              return_piece_list = return_piece_list.concat(temporary_return_piece_list);

              //対駒が認識された場合、クリック座標を格納※x,yの順で格納
              valid_click_state = [x, y];

              newTurnColor = 3 - turnColor;

              break;
            }
          }
        }
      }

      return [valid_click_state, return_piece_list];
    }

    //8方向参照
    const Possible_click_positions = (positions: number[][]) => {
      let result: { yellow_position: number[]; taigoma_positions: number[] } | undefined =
        undefined;
      const yellow_positions: number[][] = [];
      const taigoma_positions: number[][] = [];
      positions.forEach((a_position) => {
        directions.forEach((one_direction) => {
          if (
            board[a_position[0] + one_direction[0]]?.[a_position[1] + one_direction[1]] ===
            3 - turnColor
          ) {
            result = serch_turn_color(a_position, one_direction, 2);
            result && yellow_positions.push(result.yellow_position);
            result && taigoma_positions.push(result.taigoma_positions);
            return { yellow_positions, taigoma_positions };
          }
        });
      });
    };

    function specified_digit_count(search_digit: number): number[] {
      let count_digit = 0;
      for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
          if (newBoard[j][i] === search_digit) {
            count_digit++;
          }
        }
      }
      return [count_digit];
    }

    //有効クリック駒設置、駒返し処理
    const [click, return_list] = look_around(x, y);
    // console.log('return_list', return_list, return_list[0], return_list[1]);
    if (
      board[click[1]] !== undefined &&
      board[click[0]] !== undefined &&
      board[click[1]][click[0]] === 7
    ) {
      newBoard[click[1]][click[0]] = turnColor;
      setBoard(newBoard);

      for (const one_return_list of return_list) {
        newBoard[one_return_list[1]][one_return_list[0]] = turnColor;
      }

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
          // console.log('f_zero_position', f_zero_positions);
          zero_positions.push(f_zero_positions);
          // console.log('zero_position', zero_positions);
          //注意！zero_positionsは、x,yの順で格納されている
        }
      }
    }

    //pass機能
    if (x === 100 && y === 100) {
      if (turnColor === 1) {
        newblack_pass_count = newblack_pass_count + 1;
      } else if (turnColor === 2) {
        newwhite_pass_count = newwhite_pass_count + 1;
      }
      newTurnColor = 3 - turnColor;
      setTurnColor(newTurnColor);
      setblack_pass_count(newblack_pass_count);
      setwhite_pass_count(newwhite_pass_count);
    }

    //0座標から8方向参照、黄色枠位置割り出し処理
    // for (const one_zero_position of zero_positions) {
    //   for (const course of directions) {
    //     if (
    //       //0座標の隣が ※異色 の場合処理を行う

    //       newBoard[one_zero_position[1] + course[1]]?.[one_zero_position[0] + course[0]] ===
    //       3 - newTurnColor
    //     ) {
    //       //2マス目以降対駒探し
    //       for (let next_squares = 2; next_squares <= 7; next_squares++) {
    //         const x_next_squares = course[0] * next_squares + one_zero_position[0];
    //         const y_next_squares = course[1] * next_squares + one_zero_position[1];

    //         if (
    //           //対駒の前に0が来たらbreak
    //           newBoard[y_next_squares] !== undefined &&
    //           newBoard[x_next_squares] !== undefined &&
    //           newBoard[y_next_squares][x_next_squares] === 0
    //         ) {
    //           break;
    //         }

    //         if (
    //           //対駒在りの場合、0座標を'7'に変更
    //           newBoard[y_next_squares] !== undefined &&
    //           newBoard[x_next_squares] !== undefined &&
    //           newBoard[y_next_squares][x_next_squares] === newTurnColor
    //         ) {
    //           console.log('有効ゼロ座標', one_zero_position[0], one_zero_position[1]);
    //           newBoard[one_zero_position[1]][one_zero_position[0]] = 7;
    //           setBoard(newBoard);

    //           break;
    //         }
    //       }
    //     }
    //   }
    // }

    const [temporary_white_count] = specified_digit_count(2);
    const [temporary_black_count] = specified_digit_count(1);
    newblack_count = temporary_black_count;
    newwhite_count = temporary_white_count;
    setblack_count(newblack_count);
    setwhite_count(newwhite_count);
  };
  return (
    <div className={styles.container}>
      <div className={styles.game_table}>
        <p>{turnColor === 1 ? '黒' : '白'}のターンです。</p>
        <p>点数</p>
        <p>白 {white_count}</p>
        <p>黒 {black_count}</p>
        <div className={styles.caveat}>
          {white_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の白pass{white_pass_count}です。</p>
          )}
        </div>
        <div className={styles.caveat}>
          {black_pass_count === 1 && (
            <p>警告!pass2回で負け判定になります。只今の黒pass{black_pass_count}です。</p>
          )}
        </div>
        <div className={styles.caveat}>{white_pass_count === 2 && <p>警告!白の負けです。</p>}</div>
        <div className={styles.caveat}>{black_pass_count === 2 && <p>警告！黒の負けです。</p>}</div>
      </div>
      <div className={styles.pass_button} onClick={() => clickCell(100, 100)}>
        <p>pass</p>
      </div>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
              {cell !== 0 && cell !== 7 && (
                <div
                  className={styles.storn}
                  style={{ background: cell === 1 ? '#131212' : '#d5d2d2' }}
                />
              )}

              {cell === 7 && <div className={styles.signpost} key={`${x}-${y}`} />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
