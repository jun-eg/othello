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

    for (const n of directions) {
      if (
        board[y - n[1]] !== undefined &&
        board[x + n[0]] !== undefined &&
        board[y - n[1]][x + n[0]] === 3 - turnColor &&
        board[y][x] === 0
      ) {
        console.log('n位置', n);
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
            if (board[y + ncn[1]][x + ncn[0]] === 3 - turnColor) {
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
              }

              // setTurnColor(3 - turnColor);

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

    // setBoard(newBoard);

    // 黒(1)座標表示(1次元配列)
    const b_f_list: number[] = [];
    for (let by = 0; by < newBoard.length; by++) {
      for (let bx = 0; bx < newBoard[by].length; bx++) {
        if (newBoard[by][bx] === 1) {
          console.log(`黒(1)cell(${bx},${by})`);
          b_f_list.push(bx);
          b_f_list.push(by);
        }
      }
    }

    console.log('b_f_list', b_f_list);
    //黒(1)座標2次元配列化

    const b_list = [];

    for (let i = 0; i < b_f_list.length; i += 2) {
      const row = [b_f_list[i], b_f_list[i + 1]];
      b_list.push(row);
    }
    ('');
    console.log('b_list', b_list);

    //白(2)座標表示(1次元配列)
    const w_f_list = [];
    // const wwww_list: number[][] = [];
    for (let wy = 0; wy < newBoard.length; wy++) {
      for (let wx = 0; wx < newBoard[wy].length; wx++) {
        if (newBoard[wy][wx] === 2) {
          console.log(`白(2)cell(${wx}, ${wy})`);
          w_f_list.push(wx);
          w_f_list.push(wy);
        }
      }
    }
    console.log('w_f_list', w_f_list);

    //白(2)座標2次元配列化
    const w_list = [];

    for (let i = 0; i < w_f_list.length; i += 2) {
      const row = [w_f_list[i], w_f_list[i + 1]];
      w_list.push(row);
    }
    console.log('w_list', w_list);
    console.log('tc', turnColor);
    // setTurnColor(3 - turnColor);
    //(白)黄枠directions的な
    //空マス座標リスト

    //黒ターンの時隣白
    const b_yellow_list: number[][] = [];
    if (turnColor === 2) {
      for (const s_b of b_list) {
        for (const n of directions) {
          // console.log('s_w', s_w, 'n', n);

          if (
            newBoard[s_b[1] - n[1]] !== undefined &&
            newBoard[s_b[0] - n[0]] !== undefined &&
            newBoard[s_b[1] - n[1]][s_b[0] - n[0]] === turnColor
          ) {
            console.log('s_b', s_b, 'n', n);
            //ｎのyの符号修正
            if (n[1] !== 0) {
              console.log('s_b,y符修必', n[1]);
              n[1] = n[1] * -1;
              console.log('s_b,y符修済', n[1]);
            }
            //3コマ目以降空マス探し
            const cn: number[][] = [[n[0] * 2], [n[1] * 2]];

            console.log('cn', cn);

            const ncn: number[] = cn.flat();
            console.log('2n', ncn);

            let fc = 2;

            //設置可能配列選別3マス目以降
            for (let cf = 0; cf < 7; cf++) {
              if (newBoard[s_b[1] + ncn[1]] && newBoard[s_b[1] + ncn[1]][s_b[0] + ncn[0]]) {
                if (newBoard[s_b[1] + ncn[1]][s_b[0] + ncn[0]] === 3 - turnColor) {
                  ncn[1] = n[1] * fc;
                  ncn[0] = n[0] * fc;

                  console.log('11111');
                  fc++;

                  console.log('3駒目以降2駒目と同色', newBoard[s_b[1] + ncn[1]][s_b[0] + ncn[0]]);
                }
              }
            }
          }
        }
      }
    }
    console.log('b_yellow_list', b_yellow_list);
    // setTurnColor(3 - turnColor);
    setBoard(newBoard);
  };
  return (
    <div className={styles.container}>
      <div className={styles.board}>
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
              {cell !== 0 && (
                <div
                  className={styles.storn}
                  style={{ background: cell === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
