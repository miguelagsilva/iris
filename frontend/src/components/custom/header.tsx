import React, { useEffect, useState } from "react";
import { CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../ui/breadcrumb";
import { Link, useLocation } from "react-router-dom";
import { z } from "zod";

type HeaderProps = {
  handleSignOut: () => void
}

export function Header({ handleSignOut }: HeaderProps) {
  const location = useLocation();
  const [breadcrumbPathElements, setBreadcrumbPathElements] = useState<string[]>([]);

  const isUUID = (segment: string): boolean => {
    try {
      z.string().uuid().parse(segment);
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => {
    setBreadcrumbPathElements(location.pathname.split("/").filter(Boolean));
  }, [location.pathname]);

  const BreadcrumbItems = () => (
    <>
      {breadcrumbPathElements.slice(1).map((path, index) => (
        <React.Fragment key={path}>
          {index > 0 && <BreadcrumbSeparator />}
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link className="capitalize" to={`/${breadcrumbPathElements.slice(0, index + 2).join('/')}`}>
                {isUUID(path) ?
                  'Details' :
                  `${path}`
                }
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <header className="flex flex-row h-14 justify-between items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
      <Breadcrumb>
        <BreadcrumbList className="text-md ml-10 md:ml-0">
          <BreadcrumbItems />
        </BreadcrumbList>
      </Breadcrumb>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <CircleUser className="h-5 w-5" />
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut}>Sign out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
