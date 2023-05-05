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

    let return_check = 0;
    for (const n of directions) {
      if (
        board[y - n[1]] !== undefined &&
        board[x + n[0]] !== undefined &&
        board[y - n[1]][x + n[0]] === 3 - turnColor &&
        board[y - n[1]][x - n[0]] !== 3 &&
        board[y][x] === 3
      ) {
        console.log('n位置', x - n[0], y - n[1], board[y - n[1]][x - n[0]]);
        console.log('tc', turnColor);

        console.log('for修前', n[0], n[1]);

        //nのy符号修正
        if (n[1] !== 0) {
          console.log('y符修必', n[1]);
          n[1] = n[1] * -1;
          console.log('y符修済', n[1]);
        }

        console.log('for修後', n[0], n[1]);

        //対駒探し
        const cn: number[][] = [[n[0] * 2], [n[1] * 2]];

        console.log('cn', cn);

        const ncn: number[] = cn.flat();

        let fc = 2;

        //臨時保存りスト

        const list: number[][] = [[n[0]], [n[1]]];

        // 返り駒在り配列選別
        for (let cf = 0; cf < 7; cf++) {
          if (board[y + ncn[1]] && board[y + ncn[1]][x + ncn[0]]) {
            if (
              board[y + ncn[1]][x + ncn[0]] === 3 - turnColor &&
              board[y + ncn[1]][x + ncn[0]] !== 3
            ) {
              ncn[1] = n[1] * fc;

              ncn[0] = n[0] * fc;

              // 臨時保存リスト追加
              list[0].push(ncn[0]);
              list[1].push(ncn[1]);

              fc++;
              console.log('異色', ncn[0], ncn[1]);
            } else if (board[y + ncn[1]][x + ncn[0]] === turnColor) {
              console.log('対駒在り', ncn[0], ncn[1]);

              //駒裏返し
              for (let i = 0; i < list.length; i++) {
                for (let j = 0; j < list[i].length; j++) {
                  console.log('list[x]', list[i], 'list[y]', list[j]);
                }
              }

              const list_f: number[] = [];

              // リスト順番修正

              for (let lx = 0; lx < list[0].length; lx++) {
                for (let ly = 0; ly < list.length; ly++) {
                  list_f.push(list[ly][lx]);
                }
                console.log('list_f', list_f);
              }

              //返る駒、自分の駒設置
              for (let d = 0; d < list_f.length; d += 2) {
                const lx = list_f[d];
                const ly = list_f[d + 1];
                console.log('返る駒位置', [x + lx], [y + ly]);
                newBoard[y][x] = turnColor;
                newBoard[y + ly][x + lx] = turnColor;
                setTurnColor(3 - turnColor);
                setBoard(newBoard);
                return_check = 8;
              }

              break;
            } else {
              console.log('対駒無し', ncn[0], ncn[1]);
              break;
            }
          } else {
            break;
          }
        }
      }
    }
    if (return_check === 8) {
      console.log('変更済み');

      for (let i = 0; i < newBoard.length; i++) {
        for (let j = 0; j < newBoard[i].length; j++) {
          console.log('黄枠位置リセット');
          if (newBoard[j][i] === 3) {
            newBoard[j][i] = 0;
          }
        }
      }
      const zero_positions: number[][] = [];
      for (let zy = 0; zy < newBoard.length; zy++) {
        for (let zx = 0; zx < newBoard[zy].length; zx++) {
          if (newBoard[zy][zx] === 0) {
            // console.log('空(0)座標xy', zx, zy);
            const f_zero_positions: number[] = [];
            f_zero_positions.push(zx);
            f_zero_positions.push(zy);
            zero_positions.push(f_zero_positions);
            //注意！zero_positionsは、x,yの順で格納されている
          }
        }
      }
      console.log('0座標', zero_positions);
      console.log('返り確認', newBoard[3][4]);
      //0,8方向参照yellow_list作成、表示
      const yellow_list: number[][] = [];
      for (const one_zero_position of zero_positions) {
        console.log('one_zero_position', one_zero_position);
        for (const exposure of directions) {
          for (let scale = 1; scale <= 7; scale++) {
            const newY = exposure[1] * scale + one_zero_position[1];
            const newX = exposure[0] * scale + one_zero_position[0];

            if (newBoard[newY + exposure[1]] !== undefined) {
              if (newBoard[newX + exposure[0]] !== undefined) {
                if (
                  newBoard[one_zero_position[1] + exposure[1]][
                    one_zero_position[0] + exposure[0]
                  ] === 3
                ) {
                  break;
                } else if (
                  newBoard[one_zero_position[1] + exposure[1]][
                    one_zero_position[0] + exposure[0]
                  ] === 0
                ) {
                  break;
                } else if (
                  newBoard[one_zero_position[1] + exposure[1]][
                    one_zero_position[0] + exposure[0]
                  ] === turnColor
                ) {
                  if (newBoard[newY][newX] === 3 - turnColor) {
                    console.log('有効0座標xy', one_zero_position);
                    yellow_list.push(one_zero_position);
                    for (const one_yellow of yellow_list) {
                      newBoard[one_yellow[1]][one_yellow[0]] = 3;
                    }
                    setBoard(newBoard);
                    // console.log('one_zero_position', one_zero_position);
                    yellow_list.push(one_zero_position);
                  }
                }
              }
            }
          }
        }
      }
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
