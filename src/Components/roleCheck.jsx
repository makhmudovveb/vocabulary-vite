import { useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function CheckRole() {
  useEffect(() => {
    const auth = getAuth();

    // Ждём, когда Firebase определит текущего пользователя
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Принудительно обновляем токен, чтобы получить новые custom claims
          const tokenResult = await user.getIdTokenResult(true);
          console.log("Custom claims:", tokenResult.claims);

          // Проверка ролей
          if (tokenResult.claims.admin) {
            console.log("Пользователь — админ");
          } else if (tokenResult.claims.teacher) {
            console.log("Пользователь — учитель");
          } else {
            console.log("Пользователь — ученик");
          }
        } catch (err) {
          console.error("Ошибка при получении токена:", err);
        }
      } else {
        console.log("Пользователь не вошёл");
      }
    });

    // Очистка подписки при размонтировании
    return () => unsubscribe();
  }, []);

  return null; // Этот компонент просто проверяет роли, UI не нужен
}
