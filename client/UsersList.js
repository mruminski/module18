import React from 'react';
import styles from './UsersList.css';

const UsersList = props => (
  <div className={styles.users}>
    <div className={styles.users__online}>
      {props.users.length} users online
    </div>
    <ul className={styles.users__list}>
      {
        (props.users.length > 0) ?
          props.users.map((user) => (
            <li key={user.id} className={styles.user__item}>
              {user.name}
            </li>
          )) : null
      }
    </ul>
  </div>
);

export default UsersList;