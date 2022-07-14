-- phpMyAdmin SQL Dump
-- version 5.1.3
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th7 14, 2022 lúc 10:24 PM
-- Phiên bản máy phục vụ: 10.4.24-MariaDB
-- Phiên bản PHP: 7.4.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `htgqd`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `address`
--

CREATE TABLE `address` (
  `id` int(10) NOT NULL,
  `latitude_company` varchar(100) NOT NULL,
  `longitude_company` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `address`
--

INSERT INTO `address` (`id`, `latitude_company`, `longitude_company`) VALUES
(1, '21.199870601292957', '105.99032151778287'),
(2, '21.025252877941288', '105.78495012577612'),
(3, '21.03101779024436', '105.78282715208606'),
(4, '20.93537517398236', '105.84621245461538'),
(5, '21.03072905996961', '105.76133210778414'),
(6, '21.00702591262848', '105.84313338314284');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `company`
--

CREATE TABLE `company` (
  `id` int(10) NOT NULL,
  `name` varchar(30) NOT NULL,
  `rank` int(10) NOT NULL,
  `id_address` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `company`
--

INSERT INTO `company` (`id`, `name`, `rank`, `id_address`) VALUES
(1, 'SamSung', 1, 1),
(2, 'Viettel', 2, 2),
(3, 'FPT', 3, 3),
(4, 'VinFast', 4, 4),
(5, 'Garena', 5, 5),
(6, 'TTMT Bách Khoa', 1, 6);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `work`
--

CREATE TABLE `work` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `salary` int(30) NOT NULL,
  `num_of_years_of_xp` int(10) NOT NULL,
  `degree_required` int(10) NOT NULL,
  `id_company` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Đang đổ dữ liệu cho bảng `work`
--

INSERT INTO `work` (`id`, `name`, `salary`, `num_of_years_of_xp`, `degree_required`, `id_company`) VALUES
(1, 'Nhân Viên Kinh Doanh', 13000000, 3, 3, 1),
(2, 'Nhân Viên Khinh Doanh', 10000000, 1, 2, 2),
(3, 'Nhân Viên Kinh Doanh', 15000000, 2, 1, 3),
(4, 'Nhân Viên Khinh Doanh', 11000000, 2, 2, 4),
(5, 'Nhân Viên Kinh Doanh', 10000000, 4, 3, 5),
(6, 'Nhân Viên Kinh Doanh', 7000000, 6, 3, 6);

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `address`
--
ALTER TABLE `address`
  ADD PRIMARY KEY (`id`);

--
-- Chỉ mục cho bảng `company`
--
ALTER TABLE `company`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_address` (`id_address`);

--
-- Chỉ mục cho bảng `work`
--
ALTER TABLE `work`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_company` (`id_company`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `address`
--
ALTER TABLE `address`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `company`
--
ALTER TABLE `company`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT cho bảng `work`
--
ALTER TABLE `work`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
