"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
// export const config = {
//   'username': process.env.POSTGRES_USERNAME,
//   'password': process.env.POSTGRES_PASSWORD,
//   'database': process.env.POSTGRES_DB,
//   'host': process.env.POSTGRES_HOST,
//   'dialect': 'postgres',
//   'aws_region': process.env.AWS_REGION,
//   'aws_profile': process.env.AWS_PROFILE,
//   'aws_media_bucket': process.env.AWS_BUCKET,
//   'url': process.env.URL,
//   'jwt': {
//     'secret': process.env.JWT_SECRET,
//   },
// };
exports.config = {
    'dialect': 'postgres',
    'port': 5432,
    'username': 'postgres',
    'password': '123456',
    'database': 'udacity',
    'host': '192.168.68.109',
    'aws_region': 'us-east-1',
    'aws_profile': 'udacity_learning_3_ok',
    'aws_media_bucket': 'project3trungnd10',
    'url': 'http://localhost:8100',
    'jwt': {
        'secret': 'trung30220',
    },
};
