import { Link, useLocation, useNavigate } from "react-router-dom";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { Container, Grid } from "@mui/material";
import BlockComponent from "@core/api-components/BlockComponent";
import { adminLinks, adminHeaderLinks, BasicHeaderLinks } from ".";
import BasicMenu from "@core/basic-components/BasicMenu";
import { Fragment } from "react";
import { useAppSelector } from "redux/hooks";
import { useTranslation } from "react-i18next";
import logo from "assets/Tlogo.png";
import { config } from "config";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { pathname, search } = useLocation();
  const { t } = useTranslation();
  const user = useAppSelector((state) => state.auth.user);

  if (!user || pathname === "/") return <></>;

  return (
    <header>
      <div className="navbar">
        <Container maxWidth="lg">
          <Grid container alignItems="center">
            <Grid item xs={12} sm={2}>
              <Link to="/products">
                <div className="logo">
                  <img
                    src={logo}
                    alt="logo"
                    loading="lazy"
                    width={"40px"}
                    height={"100%"}
                  />
                </div>
              </Link>
            </Grid>
            <Grid item xs={12} sm={8} lg={8}>
              <BlockComponent allowedRoles={["admin"]}>
                <ul className="ILinks-ul">
                  <li className="ILinks-lower">
                    {adminLinks.length > 0 &&
                      adminLinks.map(({ to, text, active, options }, i) => (
                        <Fragment key={i}>
                          {options ? (
                            <BasicMenu
                              avatar={false}
                              color="black"
                              sx={{fontSize:"15.2px"}}
                              list={options.map(({ to, text }: any) => ({
                                text: t(text),
                                onClick: () => navigate(to),
                              }))}
                            >
                              {t(text)}
                              <ArrowDropDownIcon />
                            </BasicMenu>
                          ) : (
                            <Link
                              to={to ?? ""}
                              className={
                                pathname + search === active
                                  ? "active"
                                  : pathname.includes(active ?? "")
                                  ? "active"
                                  : ""
                              }
                            >
                              {t(text)}
                            </Link>
                          )}
                        </Fragment>
                      ))}
                  </li>
                </ul>
              </BlockComponent>
            </Grid>

            {/* User Dropdown */}
            <Grid item xs={12} sm={2}>
              <ul>
                <li className="ILinks">
                  <div
                    style={{
                      padding: "10px 0px 0px 0px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "10px",
                    }}
                  >
                    <BasicMenu
                      avatar={true}
                      list={(user?.role !== "admin"
                        ? BasicHeaderLinks
                        : adminHeaderLinks
                      ).map(({ to, text, onClick }) => ({
                        text: t(text),
                        onClick: onClick || (() => to && navigate(to)),
                      }))}
                      Avatarsx={{ border: "1px solid black" }}
                      src={
                        user?.profileImage
                          ? config.API_URL + user?.profileImage
                          : ""
                      }
                    >
                      {user?.fullName?.charAt()}
                    </BasicMenu>
                  </div>
                </li>
              </ul>
            </Grid>
          </Grid>
        </Container>
      </div>
    </header>
  );
}
